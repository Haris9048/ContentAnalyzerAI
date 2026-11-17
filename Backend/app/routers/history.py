from fastapi import APIRouter, Depends, HTTPException

from ..database import analyses, serialize, to_oid
from ..security import get_current_user

router = APIRouter()


@router.get("")
def get_history(
    current_user: dict = Depends(get_current_user)
):
    cursor = analyses.find({
        "user_id": str(current_user["_id"])
    }).sort("created_at", -1)

    return [serialize(item) for item in cursor]


@router.delete("/{analysis_id}")
def delete_history(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    oid = to_oid(analysis_id)

    result = analyses.delete_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="History item not found"
        )

    return {"message": "History item deleted successfully"}