from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from ..database import users, serialize
from ..schemas import RegisterIn, LoginIn
from ..security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


@router.post("/register")
def register(data: RegisterIn):
    email = data.email.lower()

    existing = users.find_one({"email": email})

    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )

    user = {
        "name": data.name,
        "email": email,
        "password": hash_password(data.password),
        "created_at": datetime.now(timezone.utc)
    }

    result = users.insert_one(user)

    user_id = str(result.inserted_id)

    return {
        "access_token": create_access_token(user_id),
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": data.name,
            "email": email
        }
    }


@router.post("/login")
def login(data: LoginIn):
    email = data.email.lower()

    user = users.find_one({"email": email})

    if not user or not verify_password(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    user_id = str(user["_id"])

    return {
        "access_token": create_access_token(user_id),
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"]
        }
    }