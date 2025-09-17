from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Comment(BaseModel):
    """Pydantic model for a comment entity."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    post_id: UUID
    user_id: UUID
    content: str = Field(..., min_length=1, description="Content cannot be empty")
    created_at: datetime

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Content cannot be empty")
        return trimmed
