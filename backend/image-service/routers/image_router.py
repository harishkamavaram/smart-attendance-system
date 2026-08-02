from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse
from typing import List
from pathlib import Path
import modal
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.database import get_db

from services.helpers import insert_images_to_modal

router = APIRouter(prefix="/api/v1/images", tags=["Image-service"])

Volume=modal.Volume.from_name("uploaded-images")
IMAGE_DIR = Path("/images")

@router.post("/insertStudentImages")
async def upload_student_images(
    student_id: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    response = await insert_images_to_modal(files=files)
    now = datetime.utcnow()
    uploaded_urls = []
    
    for image in response["results"]:
        if "imageUrl" not in image:
            continue

        image_url = image["imageUrl"]
        uploaded_urls.append(image_url)

        student = db.execute(
            text("""
                SELECT *
                FROM students
                WHERE id = :id
            """),
            {"id": student_id}
        ).mappings().first()

        if not student:
            return {"message": "Student not found"}

        # Update hasImages
        db.execute(
            text("""
                UPDATE students
                SET has_images = true
                WHERE id = :id
            """),
            {"id": student_id}
        )

        # Insert image
        db.execute(
            text("""
                INSERT INTO student_images (
                    student_id,
                    image_url,
                    created_at,
                    updated_at
                )
                VALUES (
                    :student_id,
                    :image_url,
                    :created_at,
                    :updated_at
                )
            """),
            {
                "student_id": student_id,
                "image_url": image_url,
                "created_at": now,
                "updated_at": now,
            }
        )
    

    db.commit()

    return {
        "message": "Images uploaded successfully",
        "student_id": student_id,
        "image_urls": uploaded_urls
    }

@router.post("/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    return await insert_images_to_modal(files=files)


# Get Image By URL For Client
@router.get("/{filename}")
async def get_image(filename: str):
    Volume.reload()

    file_path = IMAGE_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(str(file_path))
