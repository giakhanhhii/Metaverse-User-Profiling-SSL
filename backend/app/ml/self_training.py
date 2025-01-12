"""
Semi-supervised self-training loop.

1. Start with a labeled seed set (from CLIP zero-shot).
2. Train all 5 classifiers on the labeled pool.
3. Predict unlabeled samples; add high-confidence predictions to labeled pool.
4. Repeat for N iterations.
5. Return final labels + confidence for every sample.
"""
from __future__ import annotations

import logging

import numpy as np

from app.config import settings
from app.ml.classifier import ModelWrapper, build_all_models

logger = logging.getLogger(__name__)


def run_self_training(
    embeddings: np.ndarray,
    seed_labels: list[str | None],   # None = unlabeled
    confidence_threshold: float = settings.self_training_confidence,
    iterations: int = settings.self_training_iterations,
) -> tuple[dict[str, ModelWrapper], np.ndarray, np.ndarray]:
    """
    Returns:
        trained_models  – dict of fitted ModelWrapper objects
        final_labels    – (N,) array of string labels for every sample
        final_confs     – (N,) array of float confidence scores
    """
    N = len(embeddings)
    labels = np.array(seed_labels, dtype=object)  # None for unlabeled

    for iteration in range(iterations):
        labeled_mask = labels != None  # noqa: E711
        n_labeled = labeled_mask.sum()
        logger.info("Iteration %d: %d labeled / %d total", iteration + 1, n_labeled, N)

        if n_labeled < 5:
            logger.warning("Too few labeled samples (%d); skipping training.", n_labeled)
            break

        X_labeled = embeddings[labeled_mask]
        y_labeled = labels[labeled_mask].astype(str)

        models = build_all_models()
        for m in models.values():
            m.fit(X_labeled, y_labeled)

        # Predict unlabeled
        unlabeled_mask = ~labeled_mask
        if not unlabeled_mask.any():
            break

        X_unlabeled = embeddings[unlabeled_mask]
        unlabeled_indices = np.where(unlabeled_mask)[0]

        # Use ensemble voting: average probabilities across all models
        proba_sum = None
        for m in models.values():
            p = m.predict_proba(X_unlabeled)
            if proba_sum is None:
                proba_sum = p
                classes = m.classes_
            else:
                # align columns if class sets differ
                proba_sum += p

        ensemble_proba = proba_sum / len(models)
        max_conf = ensemble_proba.max(axis=1)
        predicted_cls = np.array(classes)[ensemble_proba.argmax(axis=1)]

        newly_labeled = 0
        for i, (idx, conf, pred) in enumerate(zip(unlabeled_indices, max_conf, predicted_cls)):
            if conf >= confidence_threshold:
                labels[idx] = pred
                newly_labeled += 1

        logger.info("  Added %d pseudo-labels (conf >= %.2f)", newly_labeled, confidence_threshold)
        if newly_labeled == 0:
            break

    # Final pass: train on all labeled data and predict everything
    labeled_mask = labels != None  # noqa: E711
    X_labeled = embeddings[labeled_mask]
    y_labeled = labels[labeled_mask].astype(str)

    final_models = build_all_models()
    for m in final_models.values():
        m.fit(X_labeled, y_labeled)

    # Build final predictions for ALL samples
    proba_sum = None
    for m in final_models.values():
        p = m.predict_proba(embeddings)
        if proba_sum is None:
            proba_sum = p
            classes = m.classes_
        else:
            proba_sum += p

    ensemble_proba = proba_sum / len(final_models)
    final_labels = np.array(classes)[ensemble_proba.argmax(axis=1)]
    final_confs = ensemble_proba.max(axis=1)

    return final_models, final_labels, final_confs
