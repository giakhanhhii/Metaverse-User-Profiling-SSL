"""
Generate export files for a dataset: CSV, Excel, JSON, PDF.
"""
from __future__ import annotations

import io
import json
import uuid
from pathlib import Path

import pandas as pd
from fpdf import FPDF
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.image import Image as ImageModel
from app.models.model_metric import ModelMetric
from app.models.prediction import ImagePrediction
from app.models.user_feature import UserFeature


async def _get_image_df(db: AsyncSession, dataset_id: str) -> pd.DataFrame:
    result = await db.execute(
        select(ImageModel, ImagePrediction)
        .join(ImagePrediction, ImagePrediction.image_id == ImageModel.id, isouter=True)
        .where(ImageModel.dataset_id == dataset_id)
        .where(ImagePrediction.model_name == "random_forest")
    )
    rows = []
    for img, pred in result.all():
        rows.append({
            "image_id": img.id,
            "user_id": img.user_id,
            "file_name": img.file_name,
            "manual_label": img.manual_label or "",
            "predicted_label": pred.predicted_label if pred else "",
            "confidence": round(pred.confidence, 4) if pred else 0.0,
            "is_correct": pred.is_correct if pred else None,
        })
    return pd.DataFrame(rows)


async def _get_user_df(db: AsyncSession, dataset_id: str) -> pd.DataFrame:
    result = await db.execute(select(UserFeature).where(UserFeature.dataset_id == dataset_id))
    rows = []
    for uf in result.scalars().all():
        rows.append({
            "user_id": uf.user_id,
            "total_images": uf.total_images,
            "top_interests": ", ".join(json.loads(uf.top_interests)),
            "recommended_ads": ", ".join(json.loads(uf.recommended_ads)),
        })
    return pd.DataFrame(rows)


async def _get_metrics_df(db: AsyncSession, dataset_id: str) -> pd.DataFrame:
    result = await db.execute(select(ModelMetric).where(ModelMetric.dataset_id == dataset_id))
    rows = []
    for m in result.scalars().all():
        rows.append({
            "model_name": m.model_name,
            "accuracy": round(m.accuracy, 4),
            "precision": round(m.precision, 4),
            "recall": round(m.recall, 4),
            "f1_score": round(m.f1_score, 4),
        })
    return pd.DataFrame(rows)


async def export_csv(db: AsyncSession, dataset_id: str) -> Path:
    img_df = await _get_image_df(db, dataset_id)
    path = settings.exports_dir / f"{dataset_id}_images.csv"
    img_df.to_csv(path, index=False, encoding="utf-8-sig")
    return path


async def export_excel(db: AsyncSession, dataset_id: str) -> Path:
    img_df = await _get_image_df(db, dataset_id)
    user_df = await _get_user_df(db, dataset_id)
    metrics_df = await _get_metrics_df(db, dataset_id)

    path = settings.exports_dir / f"{dataset_id}_report.xlsx"
    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        img_df.to_excel(writer, sheet_name="Image Results", index=False)
        user_df.to_excel(writer, sheet_name="User Profiles", index=False)
        metrics_df.to_excel(writer, sheet_name="Model Metrics", index=False)
    return path


async def export_json(db: AsyncSession, dataset_id: str) -> Path:
    img_df = await _get_image_df(db, dataset_id)
    user_df = await _get_user_df(db, dataset_id)
    metrics_df = await _get_metrics_df(db, dataset_id)

    data = {
        "dataset_id": dataset_id,
        "images": img_df.to_dict(orient="records"),
        "users": user_df.to_dict(orient="records"),
        "metrics": metrics_df.to_dict(orient="records"),
    }
    path = settings.exports_dir / f"{dataset_id}_report.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


async def export_pdf(db: AsyncSession, dataset_id: str) -> Path:
    metrics_df = await _get_metrics_df(db, dataset_id)
    user_df = await _get_user_df(db, dataset_id)

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Metaverse User Profiling Report", ln=True, align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 8, f"Dataset ID: {dataset_id}", ln=True)
    pdf.ln(4)

    # Model metrics table
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "Model Performance", ln=True)
    pdf.set_font("Helvetica", "B", 9)
    for col in metrics_df.columns:
        pdf.cell(38, 7, str(col), border=1)
    pdf.ln()
    pdf.set_font("Helvetica", "", 9)
    for _, row in metrics_df.iterrows():
        for val in row:
            pdf.cell(38, 7, str(val), border=1)
        pdf.ln()

    pdf.ln(6)

    # User profiles table
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "User Profiles (Top 20)", ln=True)
    pdf.set_font("Helvetica", "B", 9)
    cols = ["user_id", "total_images", "top_interests", "recommended_ads"]
    widths = [30, 25, 65, 65]
    for col, w in zip(cols, widths):
        pdf.cell(w, 7, col, border=1)
    pdf.ln()
    pdf.set_font("Helvetica", "", 8)
    for _, row in user_df.head(20).iterrows():
        for col, w in zip(cols, widths):
            pdf.cell(w, 7, str(row[col])[:40], border=1)
        pdf.ln()

    path = settings.exports_dir / f"{dataset_id}_report.pdf"
    pdf.output(str(path))
    return path
