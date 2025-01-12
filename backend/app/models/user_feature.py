import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserFeature(Base):
    __tablename__ = "user_features"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id: Mapped[str] = mapped_column(String, ForeignKey("datasets.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    total_images: Mapped[int] = mapped_column(Integer, default=0)
    top_interests: Mapped[str] = mapped_column(Text, default="[]")           # JSON list
    interest_distribution: Mapped[str] = mapped_column(Text, default="{}")   # JSON dict
    recommended_ads: Mapped[str] = mapped_column(Text, default="[]")         # JSON list
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    dataset: Mapped["Dataset"] = relationship("Dataset", back_populates="user_features")
