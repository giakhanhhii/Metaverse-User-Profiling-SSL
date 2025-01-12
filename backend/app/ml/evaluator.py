"""
Compute per-model evaluation metrics against ground-truth labels.
If no manual labels exist, uses the ensemble final_labels as pseudo-ground-truth.
"""
from __future__ import annotations

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

from app.ml.classifier import ModelWrapper


def evaluate_model(
    model: ModelWrapper,
    X_test: np.ndarray,
    y_test: np.ndarray,
) -> dict:
    y_pred = model.predict(X_test)
    labels = sorted(set(y_test) | set(y_pred))

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="weighted", zero_division=0, labels=labels)
    rec = recall_score(y_test, y_pred, average="weighted", zero_division=0, labels=labels)
    f1 = f1_score(y_test, y_pred, average="weighted", zero_division=0, labels=labels)
    cm = confusion_matrix(y_test, y_pred, labels=labels).tolist()

    return {
        "model_name": model.name,
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1_score": float(f1),
        "confusion_matrix": cm,
    }


def evaluate_all(
    models: dict[str, ModelWrapper],
    X_test: np.ndarray,
    y_test: np.ndarray,
) -> list[dict]:
    return [evaluate_model(m, X_test, y_test) for m in models.values()]
