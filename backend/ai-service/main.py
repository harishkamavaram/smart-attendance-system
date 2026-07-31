import modal
import os

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
    # .add_local_dir(".", remote_path="/root",copy=False) # copy=True for Force Build
    .add_local_python_source("routers")
    .add_local_python_source("services")
    # .add_local_python_source("utils")
)

app = modal.App(
    name="smart-attendance-ai",
    image=image,
)

Volume=modal.Volume.from_name("uploaded-images")
MODEL_DIR = "/images"

Secrets=modal.Secret.from_name("facetrack-secrets")


# To RUN => modal run app.py::debug
@app.function(volumes={MODEL_DIR: Volume},
                secrets=[Secrets]
            )
def debug():
    print("PWD:", os.getcwd())
    print("FILES:", os.listdir("."))


@app.function(volumes={MODEL_DIR: Volume},
                secrets=[Secrets])
@modal.asgi_app()
def fastapi_app():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from routers.image_service import router as image_service_router
    from routers.ai_service import router as ai_service_router
    from services.qdrant import create_collection
    
    QDRANT_URL = os.environ["QDRANT_URL"]
    QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]
    # print("QDRANT_URL: ",QDRANT_URL)
    # print("QDRANT_API_KEY: ", QDRANT_API_KEY)
    
    create_collection()
    app = FastAPI(
        title="AI Service API",
        description="API for AI-powered attendance tracking",
        version="1.0.0",
        docs_url="/docs",   
        redoc_url="/redoc",
    )

    # # CORS
    # origins = [
    #     "http://localhost:5176",
    # ]
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=origins,
    #     allow_credentials=True,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    #     expose_headers=["*", "Set-Cookie", "set-cookie"],
    # )

    # Including routers
    app.include_router(ai_service_router)
    app.include_router(image_service_router)

    @app.get("/")
    def root():
        return {
            "message": "Smart Attendance AI Service",
            "status": "running"
        }
        
    return app