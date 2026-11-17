from fastapi import APIRouter, Depends

from ..database import videos
from ..security import get_current_user
from ..analytics import calculate_totals

router = APIRouter()


@router.get("/summary")
def get_summary(
    current_user: dict = Depends(get_current_user)
):
    video_list = list(
        videos.find({
            "user_id": str(current_user["_id"])
        })
    )

    return calculate_totals(video_list)