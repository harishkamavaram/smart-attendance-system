from email.mime import text

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pathlib import Path
from typing import List
import requests
import numpy as np
import cv2
import os
from dotenv import load_dotenv
from datetime import datetime, date
from uuid import uuid4
from services.database import get_db
from services.qdrant import create_student, search_face, update_student, delete_student
from insightface.app import FaceAnalysis
from sqlalchemy.orm import Session
from sqlalchemy import text
import time

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0)

router = APIRouter(prefix="/api/v1/fr", tags=["AI Service"])

load_dotenv()

IMAGE_URL_BASE = os.getenv("IMAGE_URL_BASE")
IMAGE_DIR = Path("/images")

class Student(BaseModel):
    studentId: int
    studentName: str
    imageUrls: List[str]

class RegisterRequest(BaseModel):
    students: List[Student]

class FaceRequest(BaseModel):
    sessionId: int
    courseId: int
    sectionId: str
    imageUrl: str
    isFirstImage : bool
    adminId: int
    totalStudents: int

class StudentRequest(BaseModel):
    studentId: int
    studentName: str
    imageUrls: list[str]
    


@router.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT NOW()"))
    return {"time": result.scalar()}


@router.post("/faces")
async def identify_all_faces(request: FaceRequest,db: Session = Depends(get_db)):
    
    start = time.perf_counter()
    response = requests.get(request.imageUrl, timeout=30)
    print("Download:", time.perf_counter() - start)
    
    if response.status_code != 200:
        return {"message": "Unable to download image."}

    t = time.perf_counter()
    img = cv2.imdecode(
        np.frombuffer(response.content, np.uint8),
        cv2.IMREAD_COLOR,
    )
    print("Decode:", time.perf_counter() - t)

    if img is None:
        return {"message": "Invalid image."}

    t = time.perf_counter()
    faces = app.get(img)
    print("Face detection:", time.perf_counter() - t)
    
    
    if not faces:
        return {
            "message": "No faces detected.",
            "results": []
        }

    GREEN_THRESHOLD = 0.7
    YELLOW_THRESHOLD = 0.5

    results = []
    t = time.perf_counter()
    for face in faces:

        embedding = face.embedding.tolist()

        matches = search_face(
            query_embedding=embedding,
            limit=1
        )

        x1, y1, x2, y2 = map(int, face.bbox)

        # Default values
        score = 0.0
        student_id = None
        name = "Unknown"

        if matches:
            match = matches[0]
            score = float(match.score)

            payload = match.payload or {}

            if score >= YELLOW_THRESHOLD:
                student_id = payload.get("studentId")
                name = payload.get("name", "Unknown")

        # Rectangle color
        if score >= GREEN_THRESHOLD:
            color = (0, 255, 0)           
        elif score >= YELLOW_THRESHOLD:
            color = (0, 255, 255)        
        else:
            color = (0, 0, 255)         

        # Draw rectangle
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 1)

        # Draw label
        cv2.putText(
            img,
            f"{name} ({score:.2f})",
            (x1, max(y1 - 10, 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5,
            color,
            2,
            )
        
        results.append({
            "studentId": student_id,
            "studentName": name,
            "score": score,
            "bbox": face.bbox.tolist(),
        })
    print("Vector search:", time.perf_counter() - t)

    filename = f"{datetime.now():%Y%m%d_%H%M%S}.jpg"
    filename = filename.replace(" ", "_")
    output_path = IMAGE_DIR / filename
    
    t = time.perf_counter()
    cv2.imwrite(str(output_path), img)
    print("Save image:", time.perf_counter() - t)
        
    t = time.perf_counter()

    if request.isFirstImage:
        # INSERT all students for the first image
        insert_query = text("""
            INSERT INTO attendance (
                session_id,
                student_id,
                student_name,
                confidence,
                status,
                attendance_date,
                marked_at,
                image_name,
                marked_by
            )
            SELECT
                :session_id,
                id,
                CONCAT(first_name, ' ', last_name),
                0.0,
                'ABSENT',
                CURRENT_DATE,
                NOW(),
                NULL,
                :marked_by
            FROM students
            WHERE course_id = :course_id
        """)

        db.execute(
            insert_query,
            {
                "session_id": request.sessionId,
                "course_id": request.courseId,
                "marked_by": request.adminId,
            },
        )
    else:
        # Reset existing attendance before processing a new image
        update_query = text("""
            UPDATE attendance
            SET
                status = 'ABSENT',
                confidence = 0.0,
                image_name = NULL,
                marked_at = NOW(),
                marked_by = :marked_by
            WHERE session_id = :session_id
        """)

        db.execute(
            update_query,
            {
                "session_id": request.sessionId,
                "marked_by": request.adminId,
            },
        )

    db.commit()
    
    print("DB:", time.perf_counter() - t)
    
    update_query = text("""
            UPDATE attendance
            SET
                status = 'PRESENT',
                confidence = :confidence,
                image_name = :image_name,
                marked_at = :marked_at
            WHERE
                session_id = :session_id
                AND student_id = :student_id
            """)
    
    presentCounter = 0
    totalFaces = len(faces)
    
    for result in results:
        if result["studentId"] is None:
            continue
        print(f"Student Id: {result["studentId"]}, Student Name: {result["score"]}")
        presentCounter = presentCounter + 1
        
        db.execute(
            update_query,
            {
                "confidence": float(result["score"]),
                "image_name": f"{IMAGE_URL_BASE}/{filename}",
                "marked_at": datetime.now(),
                "session_id": request.sessionId,
                "student_id": str(result["studentId"]),
            },
        )

    db.commit()
    
    insert_query = text("""
                INSERT INTO attendance_image_sessions (
                    institute_id,
                    course_id,
                    section_id,
                    session_id,
                    image_url,
                    uploaded_image_url,
                    is_first_image
                )
                VALUES (
                    :institute_id,
                    :course_id,
                    :section_id,
                    :session_id,
                    :image_url,
                    :uploaded_image_url,
                    :is_first_image
                )
            """)
    
    db.execute(
        insert_query,
        {
            "institute_id": request.adminId,
            "course_id": request.courseId,
            "section_id": request.sectionId,
            "session_id": request.sessionId,
            "image_url": request.imageUrl,
            "uploaded_image_url": f"{IMAGE_URL_BASE}/{filename}",
            "is_first_image": request.isFirstImage,
        }
    )

    db.commit()
    
    
    present_count = presentCounter
    absent_count = request.totalStudents - present_count
    
    session_update_query = text("""
            UPDATE session_details
            SET
                has_uploaded_image = TRUE,
                present = :present,
                absent = :absent,
                accuracy = :accuracy,
                status = :status
            WHERE
                id = :session_id
        """)
    # print("Length of results: ",len(results))
    # print("Total faces: ",totalFaces)
    accuracy = round((presentCounter / totalFaces) * 100, 2) if totalFaces > 0 else 0.0
    
    db.execute(
            session_update_query,
            {
                "session_id": request.sessionId,
                "present": present_count,
                "absent": absent_count,
                "accuracy": accuracy,
                "status": "Completed"
            }
        )

    db.commit()
    
    print("TOTAL: ", time.perf_counter() - t)
    return {
        # "sessionId": str(uuid4()),
        "facesDetected": len(faces),
        "results": results,
        "imageUrl": f"{IMAGE_URL_BASE}/{filename}"
    }
    
    
@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM students"))
    students = result.mappings().all()

    return {
        "message": "Get students endpoint",
        "data": students
    }

    
@router.post("/students")
async def register_students(request: RegisterRequest,db: Session = Depends(get_db)):

    results = []

    for student in request.students:

        embeddings = []

        print(f"\n========== Registering {student.studentName} ==========")

        for image_url in student.imageUrls:

            try:
                print(f"Downloading: {image_url}")

                response = requests.get(image_url, timeout=30)

                if response.status_code != 200:
                    print("Failed to download image")
                    continue

                image = cv2.imdecode(
                    np.frombuffer(response.content, np.uint8),
                    cv2.IMREAD_COLOR,
                )

                if image is None:
                    print("Invalid image")
                    continue

                faces = app.get(image)

                if len(faces) == 0:
                    print("No face detected")
                    continue

                embeddings.append(faces[0].embedding)

            except Exception as e:
                print(e)

        if len(embeddings) == 0:

            results.append(
                {
                    "point_id": 0,
                    "studentId": student.studentId,
                    "studentName": student.studentName,
                    "status": "FAILED",
                    "reason": "No valid face embeddings found",
                }
            )

            continue

        average_embedding = np.mean(embeddings, axis=0).tolist()
        
        point_id=str(uuid4())
        create_student(
            id=point_id,
            student_id=student.studentId,
            name=student.studentName,
            embedding=average_embedding,
        )
        
        update_embedding_query = text("""
                    UPDATE students
                    SET
                        has_embeddings = TRUE,
                        point_id = :point_id
                    WHERE
                        id = :id
                """)
        
        db.execute(
                update_embedding_query,
                {
                    "point_id": point_id,
                    "id": student.studentId,
                },
            )

        db.commit()
                    
        
        results.append(
            {
                "point_id":point_id,
                "studentId": student.studentId,
                "studentName": student.studentName,
                "status": "SUCCESS",
                "imagesProcessed": len(embeddings),
            }
        )

    return {
        "message": "Registration completed",
        "results": results,
    }

@router.put("/students/{point_id}")
async def update_student_embedding(
    point_id: str,
    request: StudentRequest
):
    embeddings = []

    print(f"\n========== Updating {request.studentName} ==========")

    for image_url in request.imageUrls:

        try:
            response = requests.get(image_url, timeout=30)

            if response.status_code != 200:
                continue

            image = cv2.imdecode(
                np.frombuffer(response.content, np.uint8),
                cv2.IMREAD_COLOR
            )

            if image is None:
                continue

            faces = app.get(image)

            if not faces:
                continue

            embeddings.append(faces[0].embedding)

        except Exception as e:
            print(e)

    if not embeddings:
        return {
            "point_id": point_id,
            "studentId": request.studentId,
            "studentName": request.studentName,
            "status": "FAILED",
            "reason": "No valid face embeddings found"
        }

    average_embedding = np.mean(embeddings, axis=0).tolist()

    update_student(
        point_id=point_id,
        student_id=request.studentId,
        name=request.studentName,
        embedding=average_embedding
    )

    return {
        "point_id": point_id,
        "studentId": request.studentId,
        "studentName": request.studentName,
        "status": "SUCCESS",
        "imagesProcessed": len(embeddings)
    }

@router.delete("/students/{point_id}")
async def delete_student_by_point(point_id: str):

    delete_student(point_id)

    return {
        "point_id": point_id,
        "status": "SUCCESS",
        "message": "Student deleted successfully."
    }
    
    
# @router.get("/students/{student_id}")
# async def get_student_by_id(student_id: int):

#     students = get_student(student_id)

#     if not students:
#         return {
#             "message": "Student not found"
#         }

#     point = students[0]

#     return {
#         "point_id": point.id,
#         "studentId": point.payload.get("studentId"),
#         "studentName": point.payload["name"]
#     }

# @router.get("/students")
# async def get_all_students():

#     students, _ = client.scroll(
#         collection_name=COLLECTION_NAME,
#         limit=100
#     )

#     return {
#         "count": len(students),
#         "students": [
#             {
#                 "point_id": point.id,
#                 "studentId": point.payload["studentId"],
#                 "studentName": point.payload["name"]
#             }
#             for point in students
#         ]
#     }
    