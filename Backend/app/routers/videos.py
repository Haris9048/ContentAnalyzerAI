from datetime import datetime, timezone
from pathlib import Path
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from ..config import settings
from ..database import videos, serialize, to_oid
from ..schemas import MetricsIn
from ..security import get_current_user
from ..analytics import calculate_engagement

router = APIRouter()

ALLOWED_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo"
}


@router.post("")
async def upload_video(
    title: str = Form(...),
    notes: str = Form(""),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only MP4, MOV and AVI video files are allowed"
        )

    settings.UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    extension = Path(file.filename or "video.mp4").suffix.lower()

    if extension not in [".mp4", ".mov", ".avi"]:
        extension = ".mp4"

    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = settings.UPLOAD_DIR / filename

    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    total_bytes = 0

    try:
        with file_path.open("wb") as output:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_bytes += len(chunk)

                if total_bytes > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"Maximum upload size is {settings.MAX_UPLOAD_MB} MB"
                    )

                output.write(chunk)

    except Exception:
        if file_path.exists():
            file_path.unlink()
        raise

    video = {
        "user_id": str(current_user["_id"]),
        "title": title,
        "notes": notes,
        "filename": filename,
        "original_filename": file.filename,
        "file_size": total_bytes,
        "content_type": file.content_type,
        "metrics": {
            "views": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0,
            "saves": 0,
            "reach": 0,
            "followers_gained": 0
        },
        "engagement_rate": 0,
        "created_at": datetime.now(timezone.utc)
    }

    result = videos.insert_one(video)
    video["_id"] = result.inserted_id

    return serialize(video)


@router.get("")
def list_videos(
    current_user: dict = Depends(get_current_user)
):
    cursor = videos.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1)

    return [serialize(video) for video in cursor]


@router.put("/{video_id}/metrics")
def save_metrics(
    video_id: str,
    data: MetricsIn,
    current_user: dict = Depends(get_current_user)
):
    oid = to_oid(video_id)

    video = videos.find_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })

    if not video:
        raise HTTPException(404, "Video not found")

    metrics = data.model_dump()
    engagement_rate = calculate_engagement(metrics)

    videos.update_one(
        {"_id": oid},
        {
            "$set": {
                "metrics": metrics,
                "engagement_rate": engagement_rate,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    updated = videos.find_one({"_id": oid})

    return serialize(updated)


@router.delete("/{video_id}")
def delete_video(
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

    file_path = settings.UPLOAD_DIR / video["filename"]

    if file_path.exists():
        file_path.unlink()

    videos.delete_one({"_id": oid})

    return {"message": "Video deleted successfully"}