from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List
from datetime import datetime
import cv2
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

IMAGE_URL_BASE = os.getenv("IMAGE_URL_BASE")
print("IMAGE_URL_BASE: ",IMAGE_URL_BASE)

router = APIRouter(prefix="/api/v1/fr/images", tags=["Image-service"])

IMAGE_DIR = Path("/images")

@router.post("/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    results = []

    IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    for file in files:
        contents = await file.read()

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            results.append({
                "filename": file.filename,
                "error": "Invalid image"
            })
            continue

        filename = file.filename or f"{datetime.now():%Y%m%d_%H%M%S}.jpg"
        filename = filename.replace(" ", "_")   # or "" if you want no spaces
        output_path = IMAGE_DIR / filename

        cv2.imwrite(str(output_path), img)

        results.append({
            "filename": filename,
            "message": "Image saved",
            "imageUrl": f"{IMAGE_URL_BASE}/{filename}"
        })

    return {"results": results}

# Get Image By URL For Client
@router.get("/{filename}")
async def get_image(filename: str):
    # print("Directory exists:", IMAGE_DIR.exists())
    # print("Files:", os.listdir(IMAGE_DIR))

    file_path = IMAGE_DIR / filename
    # print("Looking for:", file_path)

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(str(file_path))
