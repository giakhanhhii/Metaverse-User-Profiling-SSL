import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.dataset import Dataset
from app.schemas.dataset import DatasetOut
from app.services.upload_service import process_upload

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.post("/upload", response_model=DatasetOut, status_code=201)
async def upload_dataset(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files are accepted.")

    tmp_path = settings.upload_dir / f"tmp_{uuid.uuid4()}.zip"
    try:
        content = await file.read()
        tmp_path.write_bytes(content)
        dataset_name = Path(file.filename).stem
        dataset = await process_upload(tmp_path, dataset_name, db)
    finally:
        tmp_path.unlink(missing_ok=True)

    return dataset


@router.get("", response_model=list[DatasetOut])
async def list_datasets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).order_by(Dataset.created_at.desc()))
    return result.scalars().all()


@router.get("/{dataset_id}", response_model=DatasetOut)
async def get_dataset(dataset_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    return dataset


@router.delete("/{dataset_id}", status_code=204)
async def delete_dataset(dataset_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # Remove uploaded files
    upload_path = settings.upload_dir / dataset_id
    if upload_path.exists():
        shutil.rmtree(upload_path)

    await db.delete(dataset)
    await db.commit()
