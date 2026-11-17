from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class MetricsIn(BaseModel):
    views: int = Field(ge=0)
    likes: int = Field(ge=0)
    comments: int = Field(ge=0)
    shares: int = Field(ge=0)
    saves: int = Field(ge=0)
    reach: int = Field(ge=0)
    followers_gained: int = Field(ge=0)


class ContentIn(BaseModel):
    video_id: str | None = None
    topic: str | None = Field(default=None, max_length=300)