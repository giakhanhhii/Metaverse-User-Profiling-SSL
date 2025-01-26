"""
Orchestrates the full ML pipeline for a dataset:
  1. Load image paths from DB
  2. Extract CLIP embeddings (batched)
  3. CLIP zero-shot → seed labels
  4. Self-training loop
  5. Store predictions per image
  6. Aggregate user profiles
  7. Compute model metrics
  8. Mark dataset done
"""
from __future__ import annotations

import json
import logging
import uuid
from collections import Counter
from datetime import datetime
from pathlib import Path

import numpy as np
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import AsyncSessionLocal
from app.ml.evaluator import evaluate_all
from app.ml.feature_extractor import extract_embeddings, zero_shot_classify
from app.ml.label_map import get_ad_segments
from app.ml.self_training import run_self_training
from app.models.dataset import Dataset
from app.models.image import Image as ImageModel
from app.models.model_metric import ModelMetric
from app.models.prediction import ImagePrediction
from app.models.user_feature import UserFeature

logger = logging.getLogger(__name__)


async def _update_status(db: AsyncSession, dataset: Dataset, step: str, progress: int):
    dataset.current_step = step
    dataset.progress = progress
    await db.commit()


async def run_pipeline(dataset_id: str):
    """Entry point for BackgroundTasks. Creates its own DB session."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
        dataset = result.scalar_one_or_none()
        if not dataset:
            return

        try:
            await _run(db, dataset)
        except Exception as exc:
            logger.exception("Pipeline failed for dataset %s", dataset_id)
            dataset.status = "error"
            dataset.error_message = str(exc)
            await db.commit()


async def _run(db: AsyncSession, dataset: Dataset):
    dataset.status = "processing"
    await _update_status(db, dataset, "Đang tải ảnh…", 5)

    # 1. Load images
    result = await db.execute(select(ImageModel).where(ImageModel.dataset_id == dataset.id))
    images: list[ImageModel] = result.scalars().all()

    if not images:
        dataset.status = "error"
        dataset.error_message = "Không có ảnh hợp lệ trong dataset."
        await db.commit()
        return

    image_paths = [Path(img.file_path) for img in images]
    image_ids = [img.id for img in images]

    await _update_status(db, dataset, "Trích xuất đặc trưng CLIP…", 15)

    # 2. Extract embeddings
    embeddings = extract_embeddings(image_paths, batch_size=settings.batch_size)

    await _update_status(db, dataset, "Phân loại zero-shot…", 35)

    # 3. Zero-shot seed labels
    zero_shot_results = zero_shot_classify(embeddings, top_k=5)
    seed_labels: list[str | None] = [res[0]["label"] for res in zero_shot_results]

    await _update_status(db, dataset, "Huấn luyện bán giám sát…", 50)

    # 4. Self-training
    trained_models, final_labels, final_confs = run_self_training(
        embeddings, seed_labels
    )

    await _update_status(db, dataset, "Lưu kết quả dự đoán…", 70)

    # 5. Store predictions
    for img_id, label, conf, top_k in zip(image_ids, final_labels, final_confs, zero_shot_results):
        for model_name, model in trained_models.items():
            proba = model.predict_proba(embeddings[[image_ids.index(img_id)]])[0]
            pred_idx = proba.argmax()
            pred_label = model.classes_[pred_idx]
            pred_conf = float(proba[pred_idx])
            top_k_out = [
                {"label": model.classes_[i], "confidence": float(proba[i])}
                for i in proba.argsort()[::-1][:5]
            ]
            pred = ImagePrediction(
                id=str(uuid.uuid4()),
                image_id=img_id,
                model_name=model_name,
                predicted_label=pred_label,
                confidence=pred_conf,
                top_k_labels=json.dumps(top_k_out),
            )
            db.add(pred)

    await db.flush()
    await _update_status(db, dataset, "Tổng hợp hồ sơ người dùng…", 85)

    # 6. Aggregate user profiles
    user_image_map: dict[str, list[int]] = {}
    for i, img in enumerate(images):
        user_image_map.setdefault(img.user_id, []).append(i)

    for user_id, indices in user_image_map.items():
        user_labels = [str(final_labels[i]) for i in indices]
        dist_counter = Counter(user_labels)
        total = len(user_labels)
        distribution = {k: round(v / total, 4) for k, v in dist_counter.most_common()}
        top_interests = [k for k, _ in dist_counter.most_common(5)]
        ads = get_ad_segments(top_interests)

        uf = UserFeature(
            id=str(uuid.uuid4()),
            dataset_id=dataset.id,
            user_id=user_id,
            total_images=total,
            top_interests=json.dumps(top_interests),
            interest_distribution=json.dumps(distribution),
            recommended_ads=json.dumps(ads),
        )
        db.add(uf)

    await db.flush()
    await _update_status(db, dataset, "Tính toán chỉ số mô hình…", 92)

    # 7. Model metrics (use final_labels as pseudo ground-truth)
    y_true = final_labels.astype(str)
    metrics_list = evaluate_all(trained_models, embeddings, y_true)
    for m in metrics_list:
        mm = ModelMetric(
            id=str(uuid.uuid4()),
            dataset_id=dataset.id,
            model_name=m["model_name"],
            accuracy=m["accuracy"],
            precision=m["precision"],
            recall=m["recall"],
            f1_score=m["f1_score"],
            confusion_matrix=json.dumps(m["confusion_matrix"]),
        )
        db.add(mm)

    # 8. Save model artifacts
    for name, model in trained_models.items():
        save_path = settings.models_dir / dataset.id / f"{name}.pkl"
        model.save(save_path)

    dataset.status = "done"
    dataset.progress = 100
    dataset.current_step = "Hoàn thành!"
    dataset.processed_at = datetime.utcnow()
    await db.commit()
    logger.info("Pipeline complete for dataset %s", dataset.id)
