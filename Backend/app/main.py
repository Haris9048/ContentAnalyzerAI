
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import client, init_indexes

from .routers import auth, videos, analytics, ai, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify the Atlas connection when the backend starts.
    client.admin.command("ping")
    init_indexes()

    settings.UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    yield

    client.close()


app = FastAPI(
    title="GrowthLens API",
    description="Instagram content performance and AI analysis API",
    version="1.0.0",
    lifespan=lifespan
)


# CORS configuration for local and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "https://content-analyzer-7g8v9gil6-haris9048s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Authentication routes
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# Video routes
app.include_router(
    videos.router,
    prefix="/api/videos",
    tags=["Videos"]
)

# Analytics routes
app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"]
)

# AI routes
app.include_router(
    ai.router,
    prefix="/api/ai",
    tags=["AI"]
)

# History routes
app.include_router(
    history.router,
    prefix="/api/history",
    tags=["History"]
)


@app.get("/")
def root():
    return {
        "message": "GrowthLens API is running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
