from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class User(BaseModel):
    """Pydantic model for a user domain entity."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    name: str = Field(..., min_length=1, description="Name cannot be empty")
    email: EmailStr
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Name cannot be empty")
        return trimmed
