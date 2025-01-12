import uuid
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending|processing|done|error
    progress: Mapped[int] = mapped_column(Integer, default=0)       # 0-100
    current_step: Mapped[str] = mapped_column(String, default="")
    total_images: Mapped[int] = mapped_column(Integer, default=0)
    valid_images: Mapped[int] = mapped_column(Integer, default=0)
    invalid_images: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    images: Mapped[list["Image"]] = relationship("Image", back_populates="dataset", cascade="all, delete-orphan")
    user_features: Mapped[list["UserFeature"]] = relationship("UserFeature", back_populates="dataset", cascade="all, delete-orphan")
    model_metrics: Mapped[list["ModelMetric"]] = relationship("ModelMetric", back_populates="dataset", cascade="all, delete-orphan")
