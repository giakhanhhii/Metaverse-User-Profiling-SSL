"""
Wraps 5 sklearn classifiers behind a common interface.
Each classifier accepts (X_train, y_train) and predicts (X_test) → labels + probabilities.
"""
from __future__ import annotations

import pickle
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

CLASSIFIERS: dict[str, object] = {
    "logistic_regression": LogisticRegression(max_iter=1000, solver="lbfgs"),
    "decision_tree":       DecisionTreeClassifier(max_depth=20, random_state=42),
    "random_forest":       RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    "svm":                 SVC(kernel="rbf", probability=True, random_state=42),
    "knn":                 KNeighborsClassifier(n_neighbors=5, n_jobs=-1),
}


class ModelWrapper:
    def __init__(self, name: str):
        self.name = name
        self._clf = _clone(CLASSIFIERS[name])
        self.classes_: list[str] = []

    def fit(self, X: np.ndarray, y: np.ndarray) -> "ModelWrapper":
        self._clf.fit(X, y)
        self.classes_ = list(self._clf.classes_)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self._clf.predict(X)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        return self._clf.predict_proba(X)

    def save(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @staticmethod
    def load(path: Path) -> "ModelWrapper":
        with open(path, "rb") as f:
            return pickle.load(f)


def _clone(clf):
    """Return a fresh copy of a classifier (re-instantiate with same params)."""
    return clf.__class__(**clf.get_params())


def build_all_models() -> dict[str, ModelWrapper]:
    return {name: ModelWrapper(name) for name in CLASSIFIERS}
