from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetStatusOut
from app.services.processing_service import run_pipeline

router = APIRouter(prefix="/api/datasets", tags=["processing"])


@router.post("/{dataset_id}/process", response_model=DatasetStatusOut)
async def start_processing(
    dataset_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    if dataset.status == "processing":
        raise HTTPException(status_code=409, detail="Already processing.")

    background_tasks.add_task(run_pipeline, dataset_id)
    dataset.status = "processing"
    dataset.progress = 0
    await db.commit()
    return dataset


@router.get("/{dataset_id}/status", response_model=DatasetStatusOut)
async def get_status(dataset_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return dataset
