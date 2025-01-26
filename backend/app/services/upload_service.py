"""
Handles ZIP upload: extract → validate → register images in DB.

Expected ZIP structure:
  user_001/
    img1.jpg
    img2.png
  user_002/
    ...

Any image not inside a named folder is assigned user_id="unknown".
"""
from __future__ import annotations

import logging
import uuid
import zipfile
from pathlib import Path

from PIL import Image, UnidentifiedImageError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.dataset import Dataset
from app.models.image import Image as ImageModel

logger = logging.getLogger(__name__)

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp", ".tiff"}


async def process_upload(
    zip_path: Path,
    dataset_name: str,
    db: AsyncSession,
) -> Dataset:
    """Extract ZIP, validate images, persist DB records. Returns the new Dataset."""

    dataset_id = str(uuid.uuid4())
    extract_dir = settings.upload_dir / dataset_id
    extract_dir.mkdir(parents=True, exist_ok=True)

    dataset = Dataset(id=dataset_id, name=dataset_name, status="pending")
    db.add(dataset)
    await db.flush()

    total = 0
    valid = 0
    invalid = 0

    try:
        with zipfile.ZipFile(zip_path) as zf:
            for member in zf.infolist():
                if member.is_dir():
                    continue
                parts = Path(member.filename).parts
                ext = Path(member.filename).suffix.lower()
                if ext not in VALID_EXTENSIONS:
                    continue

                # Determine user_id from parent folder name
                user_id = parts[-2] if len(parts) >= 2 else "unknown"
                file_name = parts[-1]
                total += 1

                dest_dir = extract_dir / user_id
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest_path = dest_dir / file_name

                data = zf.read(member.filename)
                dest_path.write_bytes(data)

                # Validate readable image
                try:
                    with Image.open(dest_path) as img:
                        img.verify()
                    valid += 1
                    img_record = ImageModel(
                        id=str(uuid.uuid4()),
                        dataset_id=dataset_id,
                        user_id=user_id,
                        file_name=file_name,
                        file_path=str(dest_path),
                    )
                    db.add(img_record)
                except (UnidentifiedImageError, Exception):
                    invalid += 1
                    dest_path.unlink(missing_ok=True)

    except zipfile.BadZipFile as exc:
        dataset.status = "error"
        dataset.error_message = f"Invalid ZIP file: {exc}"
        await db.commit()
        return dataset

    dataset.total_images = total
    dataset.valid_images = valid
    dataset.invalid_images = invalid
    dataset.status = "pending"
    await db.commit()
    return dataset
