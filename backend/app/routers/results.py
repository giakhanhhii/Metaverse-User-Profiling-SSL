from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.dataset import Dataset
from app.models.image import Image as ImageModel
from app.models.model_metric import ModelMetric
from app.models.user_feature import UserFeature
from app.schemas.image import ImageListOut, ImageOut
from app.schemas.results import ModelMetricOut, UserFeatureOut

router = APIRouter(prefix="/api/datasets", tags=["results"])


def _check_done(dataset: Dataset | None):
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    if dataset.status != "done":
        raise HTTPException(status_code=400, detail="Dataset not yet processed.")


@router.get("/{dataset_id}/images", response_model=ImageListOut)
async def list_images(
    dataset_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    ds_result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = ds_result.scalar_one_or_none()
    _check_done(dataset)

    query = (
        select(ImageModel)
        .options(selectinload(ImageModel.predictions))
        .where(ImageModel.dataset_id == dataset_id)
    )
    if user_id:
        query = query.where(ImageModel.user_id == user_id)

    count_result = await db.execute(
        select(func.count()).select_from(query.subquery())
    )
    total = count_result.scalar()

    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    items = result.scalars().all()

    return ImageListOut(items=items, total=total, page=page, page_size=page_size)


@router.get("/{dataset_id}/images/{image_id}", response_model=ImageOut)
async def get_image(dataset_id: str, image_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ImageModel)
        .options(selectinload(ImageModel.predictions))
        .where(ImageModel.id == image_id, ImageModel.dataset_id == dataset_id)
    )
    img = result.scalar_one_or_none()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found.")
    return img


@router.get("/{dataset_id}/users", response_model=list[UserFeatureOut])
async def list_users(dataset_id: str, db: AsyncSession = Depends(get_db)):
    ds_result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = ds_result.scalar_one_or_none()
    _check_done(dataset)

    result = await db.execute(
        select(UserFeature)
        .where(UserFeature.dataset_id == dataset_id)
        .order_by(UserFeature.total_images.desc())
    )
    return result.scalars().all()


@router.get("/{dataset_id}/users/{user_id}", response_model=UserFeatureOut)
async def get_user(dataset_id: str, user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserFeature).where(
            UserFeature.dataset_id == dataset_id,
            UserFeature.user_id == user_id,
        )
    )
    uf = result.scalar_one_or_none()
    if not uf:
        raise HTTPException(status_code=404, detail="User profile not found.")
    return uf


@router.get("/{dataset_id}/metrics", response_model=list[ModelMetricOut])
async def get_metrics(dataset_id: str, db: AsyncSession = Depends(get_db)):
    ds_result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = ds_result.scalar_one_or_none()
    _check_done(dataset)

    result = await db.execute(
        select(ModelMetric)
        .where(ModelMetric.dataset_id == dataset_id)
        .order_by(ModelMetric.f1_score.desc())
    )
    return result.scalars().all()
