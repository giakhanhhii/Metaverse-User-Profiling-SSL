"""
CLIP-based image feature extractor.
Returns 512-dim L2-normalised embeddings per image.
Also supports zero-shot classification against the 30 interest labels.
"""
from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import open_clip
import torch
from PIL import Image, UnidentifiedImageError

from app.config import settings
from app.ml.label_map import INTEREST_LABELS

logger = logging.getLogger(__name__)

_model = None
_preprocess = None
_tokenizer = None
_label_embeddings: np.ndarray | None = None
_device: str = "cuda" if torch.cuda.is_available() else "cpu"


def _load_model():
    global _model, _preprocess, _tokenizer
    if _model is not None:
        return
    logger.info("Loading CLIP model %s (%s)…", settings.clip_model_name, settings.clip_pretrained)
    _model, _, _preprocess = open_clip.create_model_and_transforms(
        settings.clip_model_name, pretrained=settings.clip_pretrained
    )
    _tokenizer = open_clip.get_tokenizer(settings.clip_model_name)
    _model = _model.to(_device).eval()
    logger.info("CLIP model loaded on %s", _device)


def _get_label_embeddings() -> np.ndarray:
    """Compute and cache text embeddings for all 30 labels."""
    global _label_embeddings
    if _label_embeddings is not None:
        return _label_embeddings
    _load_model()
    prompts = [f"a photo of {label}" for label in INTEREST_LABELS]
    tokens = _tokenizer(prompts).to(_device)
    with torch.no_grad():
        text_feats = _model.encode_text(tokens)
        text_feats /= text_feats.norm(dim=-1, keepdim=True)
    _label_embeddings = text_feats.cpu().numpy().astype(np.float32)
    return _label_embeddings


def extract_embeddings(image_paths: list[Path], batch_size: int = 32) -> np.ndarray:
    """
    Returns (N, 512) float32 array of L2-normalised CLIP embeddings.
    Invalid images are replaced with a zero vector.
    """
    _load_model()
    results: list[np.ndarray] = []

    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i : i + batch_size]
        tensors: list[torch.Tensor] = []
        valid_indices: list[int] = []

        for j, p in enumerate(batch_paths):
            try:
                img = Image.open(p).convert("RGB")
                tensors.append(_preprocess(img))
                valid_indices.append(j)
            except (UnidentifiedImageError, OSError):
                pass

        batch_result = np.zeros((len(batch_paths), 512), dtype=np.float32)

        if tensors:
            batch_tensor = torch.stack(tensors).to(_device)
            with torch.no_grad():
                feats = _model.encode_image(batch_tensor)
                feats /= feats.norm(dim=-1, keepdim=True)
            feats_np = feats.cpu().numpy().astype(np.float32)
            for idx, vi in enumerate(valid_indices):
                batch_result[vi] = feats_np[idx]

        results.append(batch_result)

    return np.vstack(results)


def zero_shot_classify(embeddings: np.ndarray, top_k: int = 5) -> list[dict]:
    """
    Classify each embedding against the 30 interest labels using cosine similarity.
    Returns list of {"label": str, "confidence": float} dicts (top_k per image).
    """
    label_emb = _get_label_embeddings()  # (30, 512)
    # (N, 30) cosine similarities → softmax probabilities
    sims = embeddings @ label_emb.T
    probs = np.exp(sims) / np.exp(sims).sum(axis=1, keepdims=True)

    results = []
    for row in probs:
        top_idx = row.argsort()[::-1][:top_k]
        results.append([
            {"label": INTEREST_LABELS[i], "confidence": float(row[i])}
            for i in top_idx
        ])
    return results
