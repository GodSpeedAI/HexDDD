# Auto-generated Python types for Comments
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date, time

class Comments:
    """Database model type definitions."""

    id: UUID
    post_id: UUID
    user_id: UUID
    content: str
    created_at: datetime

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
