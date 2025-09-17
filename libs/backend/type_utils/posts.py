# Auto-generated Python types for Posts
from typing import Any, Optional
from uuid import UUID
from datetime import datetime

class Posts:
    """Database model type definitions."""

    id: UUID
    user_id: UUID
    title: str
    content: Optional[str]
    published: bool
    created_at: datetime
    updated_at: Optional[datetime]

    def __init__(self, **kwargs: Any) -> None:
        for key, value in kwargs.items():
            setattr(self, key, value)
