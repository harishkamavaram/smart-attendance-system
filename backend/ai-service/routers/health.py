from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
def health():
    return {
        "status": "healthy"
    }


@router.get("/greet")
def greet(user: str):
    return {
        "message": f"Hello {user}"
    }