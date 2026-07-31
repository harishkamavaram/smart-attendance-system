from qdrant_client import QdrantClient, models
import os
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

print("QDRANT_URL: ",QDRANT_URL)

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)
# client = QdrantClient(url="http://localhost:6333")
# client = QdrantClient(url=QDRANT_URL) 

COLLECTION_NAME = "student_embeddings"
VECTOR_SIZE = 512 


# -----------------------------
# CREATE COLLECTION
# -----------------------------
def create_collection():
    collections = [c.name for c in client.get_collections().collections]

    if COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=VECTOR_SIZE,
                distance=models.Distance.COSINE
            )
        )
        print("Collection created.")
    else:
        print("Collection already exists.")


# -----------------------------
# CREATE STUDENT EMBEDDING
# -----------------------------
def create_student(id,student_id, name, embedding):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            models.PointStruct(
                id=id,          
                vector=embedding,
                payload={
                    "studentId": student_id,
                    "name": name
                }
            )
        ]
    )

    print("Student embedding inserted.")


# -----------------------------
# SEARCH BY FACE
# -----------------------------
def search_face(query_embedding, limit=1):
    result = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit
    )

    return result.points


# -----------------------------
# READ BY STUDENT ID
# -----------------------------
def get_student(student_id):
    result = client.scroll(
        collection_name=COLLECTION_NAME,
        scroll_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="studentId",
                    match=models.MatchValue(value=student_id)
                )
            ]
        ),
        limit=10
    )

    return result[0]


# -----------------------------
# UPDATE EMBEDDING
# -----------------------------
def update_student(point_id, student_id, name, embedding):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            models.PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "studentId": student_id,
                    "name": name
                }
            )
        ]
    )

    print("Student updated.")


# -----------------------------
# DELETE
# -----------------------------
def delete_student(point_id):
    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=models.PointIdsList(
            points=[point_id]
        )
    )

    print("Student deleted.")

