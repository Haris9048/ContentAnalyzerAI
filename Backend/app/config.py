import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    MONGO_URI = os.getenv("MONGO_URI", "")
    DB_NAME = os.getenv("DB_NAME", "growth_analyser")

    JWT_SECRET = os.getenv("JWT_SECRET", "")
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:4200"
        ).split(",")
    ]

    UPLOAD_DIR = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "100"))


settings = Settings()

if not settings.JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is missing. Add it to backend/.env"
    )

if not settings.MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is missing. Add your MongoDB Atlas URI to backend/.env"
    )