from datetime import datetime

from pydantic import BaseModel


class DatasetOut(BaseModel):
    id: str
    name: str
    status: str
    progress: int
    current_step: str
    total_images: int
    valid_images: int
    invalid_images: int
    error_message: str | None
    created_at: datetime
    processed_at: datetime | None

    model_config = {"from_attributes": True}


class DatasetStatusOut(BaseModel):
    id: str
    status: str
    progress: int
    current_step: str
    total_images: int
    valid_images: int
    error_message: str | None

    model_config = {"from_attributes": True}
