from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.dataset import Dataset
from app.services.export_service import export_csv, export_excel, export_json, export_pdf

router = APIRouter(prefix="/api/datasets", tags=["export"])


async def _get_done_dataset(dataset_id: str, db: AsyncSession) -> Dataset:
    result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found.")
    if dataset.status != "done":
        raise HTTPException(status_code=400, detail="Dataset not yet processed.")
    return dataset


@router.get("/{dataset_id}/export/csv")
async def download_csv(dataset_id: str, db: AsyncSession = Depends(get_db)):
    await _get_done_dataset(dataset_id, db)
    path = await export_csv(db, dataset_id)
    return FileResponse(path, media_type="text/csv", filename=path.name)


@router.get("/{dataset_id}/export/excel")
async def download_excel(dataset_id: str, db: AsyncSession = Depends(get_db)):
    await _get_done_dataset(dataset_id, db)
    path = await export_excel(db, dataset_id)
    return FileResponse(
        path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=path.name,
    )


@router.get("/{dataset_id}/export/json")
async def download_json(dataset_id: str, db: AsyncSession = Depends(get_db)):
    await _get_done_dataset(dataset_id, db)
    path = await export_json(db, dataset_id)
    return FileResponse(path, media_type="application/json", filename=path.name)


@router.get("/{dataset_id}/export/pdf")
async def download_pdf(dataset_id: str, db: AsyncSession = Depends(get_db)):
    await _get_done_dataset(dataset_id, db)
    path = await export_pdf(db, dataset_id)
    return FileResponse(path, media_type="application/pdf", filename=path.name)
