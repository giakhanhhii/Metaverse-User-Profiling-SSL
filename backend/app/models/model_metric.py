import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id: Mapped[str] = mapped_column(String, ForeignKey("datasets.id"), nullable=False)
    model_name: Mapped[str] = mapped_column(String, nullable=False)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    precision: Mapped[float] = mapped_column(Float, default=0.0)
    recall: Mapped[float] = mapped_column(Float, default=0.0)
    f1_score: Mapped[float] = mapped_column(Float, default=0.0)
    confusion_matrix: Mapped[str] = mapped_column(Text, default="[]")  # JSON 2D array
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    dataset: Mapped["Dataset"] = relationship("Dataset", back_populates="model_metrics")
