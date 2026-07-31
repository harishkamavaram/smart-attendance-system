    # ======================== #
    #       FASTAPI APP        #
    # ======================== #

from fastapi import FastAPI
from routers.health import router as health_router

app = FastAPI(
    title="Smart Attendance AI Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(health_router)


@app.get("/")
def root():
    return {
        "message": "Smart Attendance AI Service",
        "status": "running"
    }

