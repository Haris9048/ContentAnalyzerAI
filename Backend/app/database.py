from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException
from pymongo import MongoClient

from .config import settings

client = MongoClient(
    settings.MONGO_URI,
    serverSelectionTimeoutMS=10000
)

db = client[settings.DB_NAME]

users = db["users"]
videos = db["videos"]
analyses = db["analyses"]


def init_indexes() -> None:
    users.create_index("email", unique=True)

    videos.create_index([
        ("user_id", 1),
        ("created_at", -1)
    ])

    analyses.create_index([
        ("user_id", 1),
        ("created_at", -1)
    ])


def to_oid(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(404, "Not found")

    return ObjectId(value)


def serialize(doc: dict | None) -> dict | None:
    if doc is None:
        return None

    out = {}

    for key, value in doc.items():
        if key == "_id":
            out["id"] = str(value)

        elif isinstance(value, ObjectId):
            out[key] = str(value)

        elif isinstance(value, datetime):
            out[key] = (
                value.replace(tzinfo=None).isoformat() + "Z"
            )

        else:
            out[key] = value

    return out