import json
from datetime import datetime

from pydantic import BaseModel, model_validator


class UserFeatureOut(BaseModel):
    id: str
    dataset_id: str
    user_id: str
    total_images: int
    top_interests: list[str]
    interest_distribution: dict[str, float]
    recommended_ads: list[str]
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def parse_json_fields(cls, data):
        if hasattr(data, "__dict__"):
            for field in ("top_interests", "recommended_ads"):
                val = getattr(data, field, None)
                if isinstance(val, str):
                    setattr(data, field, json.loads(val))
            val = getattr(data, "interest_distribution", None)
            if isinstance(val, str):
                data.interest_distribution = json.loads(val)
        return data

    model_config = {"from_attributes": True}


class ModelMetricOut(BaseModel):
    id: str
    dataset_id: str
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: list[list[int]]
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def parse_confusion(cls, data):
        if hasattr(data, "__dict__"):
            val = data.confusion_matrix
            if isinstance(val, str):
                data.confusion_matrix = json.loads(val)
        return data

    model_config = {"from_attributes": True}
