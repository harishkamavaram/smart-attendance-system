import modal
import os

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
    .add_local_dir(".", remote_path="/root")
)

app = modal.App(
    name="smart-attendance-ai",
    image=image,
)

# To RUN => modal run app.py::debug
@app.function()
def debug():
    print("PWD:", os.getcwd())
    print("FILES:", os.listdir("."))


@app.function()
@modal.asgi_app()
def fastapi_app():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from routers.health import router as health_router
    
    app = FastAPI(
        title="User Authentication API",
        description="API for user authentication and session management",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS
    origins = [
        "http://localhost:5176",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*", "Set-Cookie", "set-cookie"],
    )

    # Including routers
    app.include_router(health_router)

    @app.get("/")
    def root():
        return {
            "message": "Smart Attendance AI Service",
            "status": "running"
        }

    return app