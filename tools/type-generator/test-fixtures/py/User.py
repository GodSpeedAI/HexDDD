from typing import Optional

class User:
    """User model"""
    id: str
    name: str
    email: str
    age: int
    is_active: bool
    created_at: Optional[str]
