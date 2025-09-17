from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StrictBool, field_validator


class Post(BaseModel):
    """Pydantic model for a post entity."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    user_id: UUID
    title: str = Field(..., min_length=1, description="Title cannot be empty")
    content: Optional[str] = Field(default=None, description="Content cannot be empty when provided")
    published: StrictBool
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator("title", mode="before")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("Title must be a string")
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Title cannot be empty")
        return trimmed

    @field_validator("content", mode="before")
    @classmethod
    def validate_content(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        if not isinstance(value, str):
            raise TypeError("Content must be a string")
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Content cannot be empty")
        return trimmed
