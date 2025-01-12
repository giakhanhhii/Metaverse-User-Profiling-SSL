import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ImagePrediction(Base):
    __tablename__ = "image_predictions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    image_id: Mapped[str] = mapped_column(String, ForeignKey("images.id"), nullable=False)
    model_name: Mapped[str] = mapped_column(String, nullable=False)
    predicted_label: Mapped[str] = mapped_column(String, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    top_k_labels: Mapped[str] = mapped_column(Text, default="[]")   # JSON string
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    image: Mapped["Image"] = relationship("Image", back_populates="predictions")
