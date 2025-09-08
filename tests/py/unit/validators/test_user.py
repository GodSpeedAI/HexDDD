import pytest
from pydantic import ValidationError
from uuid import uuid4
from datetime import datetime

from libs.backend.type_utils.validators.user import User

def test_user_validation_success():
    """
    Tests that a valid user object is successfully validated.
    """
    user_data = {
        "id": uuid4(),
        "name": "John Doe",
        "email": "john.doe@example.com",
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }
    user = User(**user_data)
    assert user.id == user_data["id"]
    assert user.name == user_data["name"]
    assert user.email == user_data["email"]
    assert user.created_at == user_data["created_at"]
    assert user.updated_at == user_data["updated_at"]

def test_user_validation_updated_at_none():
    """
    Tests that a valid user object with updated_at as None is successfully validated.
    """
    user_data = {
        "id": uuid4(),
        "name": "John Doe",
        "email": "john.doe@example.com",
        "created_at": datetime.now(),
        "updated_at": None,
    }
    user = User(**user_data)
    assert user.updated_at is None

def test_user_validation_invalid_id():
    """
    Tests that a user object with an invalid id raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(
            id="not-a-uuid",
            name="John Doe",
            email="john.doe@example.com",
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

def test_user_validation_empty_name():
    """
    Tests that a user object with an empty name raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(
            id=uuid4(),
            name="",
            email="john.doe@example.com",
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

def test_user_validation_invalid_email():
    """
    Tests that a user object with an invalid email raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(
            id=uuid4(),
            name="John Doe",
            email="not-an-email",
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

def test_user_validation_invalid_created_at():
    """
    Tests that a user object with an invalid created_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(
            id=uuid4(),
            name="John Doe",
            email="john.doe@example.com",
            created_at="not-a-date",
            updated_at=datetime.now(),
        )

def test_user_validation_invalid_updated_at():
    """
    Tests that a user object with an invalid updated_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(
            id=uuid4(),
            name="John Doe",
            email="john.doe@example.com",
            created_at=datetime.now(),
            updated_at="not-a-date",
        )
