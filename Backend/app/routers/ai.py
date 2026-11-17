from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from ..database import videos, analyses, serialize, to_oid
from ..schemas import ContentIn
from ..security import get_current_user
from ..gemini_service import (
    analyze_video,
    generate_ideas,
    generate_content
)

router = APIRouter()


@router.post("/analyze/{video_id}")
def analyze(
    video_id: str,
    current_user: dict = Depends(get_current_user)
):
    oid = to_oid(video_id)

    video = videos.find_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })

    if not video:
        raise HTTPException(404, "Video not found")

    result = analyze_video(
        title=video.get("title", ""),
        notes=video.get("notes", ""),
        metrics=video.get("metrics", {})
    )

    record = {
        "user_id": str(current_user["_id"]),
        "video_id": str(video["_id"]),
        "video_title": video.get("title", ""),
        "type": "analysis",
        "result": result,
        "created_at": datetime.now(timezone.utc)
    }

    saved = analyses.insert_one(record)

    record["_id"] = saved.inserted_id

    return serialize(record)


@router.post("/ideas")
def ideas(
    data: ContentIn,
    current_user: dict = Depends(get_current_user)
):
    if not data.topic:
        raise HTTPException(
            status_code=400,
            detail="Please provide a topic"
        )

    result = generate_ideas(data.topic)

    record = {
        "user_id": str(current_user["_id"]),
        "type": "ideas",
        "topic": data.topic,
        "result": result,
        "created_at": datetime.now(timezone.utc)
    }

    saved = analyses.insert_one(record)
    record["_id"] = saved.inserted_id

    return serialize(record)


@router.post("/content")
def content(
    data: ContentIn,
    current_user: dict = Depends(get_current_user)
):
    if not data.topic:
        raise HTTPException(
            status_code=400,
            detail="Please provide a topic"
        )

    result = generate_content(data.topic)

    record = {
        "user_id": str(current_user["_id"]),
        "type": "content",
        "topic": data.topic,
        "result": result,
        "created_at": datetime.now(timezone.utc)
    }

    saved = analyses.insert_one(record)
    record["_id"] = saved.inserted_id

    return serialize(record)