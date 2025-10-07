# Auto-generated Python types for Users
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date, time

class Users:
    """Database model type definitions."""

    id: UUID
    name: str
    email: str
    created_at: datetime
    updated_at: Optional[datetime]

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
