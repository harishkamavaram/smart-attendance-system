import modal
import os

image = (
    modal.Image.debian_slim()
    .pip_install_from_requirements("requirements.txt")
    .add_local_python_source("routers")
    .add_local_python_source("services")
)

app = modal.App(
    name="smart-attendance-image-service",
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
    from routers.image_router import router as image_service_router
    
    QDRANT_URL = os.environ["QDRANT_URL"]
    QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]
    DATABASE_URL = os.environ["DATABASE_URL"]
    # print("DATABASE_URL: ", DATABASE_URL)
    # print("QDRANT_URL: ",QDRANT_URL)
    # print("QDRANT_API_KEY: ", QDRANT_API_KEY)
    
    app = FastAPI(
        title="Image Service API",
        description="API for image processing and analysis",
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
    app.include_router(image_service_router)

    @app.get("/")
    def root():
        return {
            "message": "Smart Attendance Image Service",
            "status": "running"
        }
        
    return app