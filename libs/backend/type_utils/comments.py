# Auto-generated Python types for Comments
from typing import Any
from uuid import UUID
from datetime import datetime

class Comments:
    """Database model type definitions."""

    id: UUID
    post_id: UUID
    user_id: UUID
    content: str
    created_at: datetime

    def __init__(self, **kwargs: Any) -> None:
        for key, value in kwargs.items():
            setattr(self, key, value)
