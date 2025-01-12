import json
from datetime import datetime

from pydantic import BaseModel, model_validator


class TopKLabel(BaseModel):
    label: str
    confidence: float


class ImagePredictionOut(BaseModel):
    id: str
    model_name: str
    predicted_label: str
    confidence: float
    top_k_labels: list[TopKLabel]
    is_correct: bool | None

    @model_validator(mode="before")
    @classmethod
    def parse_top_k(cls, data):
        if hasattr(data, "__dict__"):
            raw = data.top_k_labels
            if isinstance(raw, str):
                data.top_k_labels = json.loads(raw)
        return data

    model_config = {"from_attributes": True}


class ImageOut(BaseModel):
    id: str
    dataset_id: str
    user_id: str
    file_name: str
    manual_label: str | None
    created_at: datetime
    predictions: list[ImagePredictionOut] = []

    model_config = {"from_attributes": True}


class ImageListOut(BaseModel):
    items: list[ImageOut]
    total: int
    page: int
    page_size: int
