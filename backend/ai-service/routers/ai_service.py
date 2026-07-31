from fastapi import APIRouter, File, UploadFile
from typing import List
from datetime import datetime
import cv2
import modal
import numpy as np
import os

router = APIRouter(prefix="/api/v1", tags=["ai-service"])

Volume=modal.Volume.from_name("uploaded-images")
MODEL_DIR = "/images"

# @router.get("/")
# def health():
#     return {
#         "status": "AI Service is running",
#         "message": "Welcome to the AI Service API",
#     }


@router.post("/upload")
async def test_upload(files: List[UploadFile] = File(...)):
    # print("Received files:", [file.filename for file in files])
    results = []

    for file in files:
        # print("Received file:", file.filename)
        # print("Content type:", file.content_type)

        contents = await file.read()

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            results.append({"filename": file.filename, "error": "Invalid image"})
            continue

        output_path = os.path.join(
            MODEL_DIR,
            file.filename or f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        )
        cv2.imwrite(output_path, img)

        results.append({
            "filename": file.filename,
            "message": "Image saved",
            # "path": output_path,
        })

    return {"results": results}