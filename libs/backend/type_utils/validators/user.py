from pydantic import BaseModel, EmailStr, constr
from uuid import UUID
from datetime import datetime
from typing import Optional

class User(BaseModel):
    """
    Pydantic model for a user.
    This model is used to validate user data on the server-side.
    """
    id: UUID
    name: constr(min_length=1)
    email: EmailStr
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
