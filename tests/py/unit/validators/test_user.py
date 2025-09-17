import pytest
from pydantic import ValidationError

from libs.backend.type_utils.validators.user import User
from tests.py.fixtures import (
    get_valid_user_data,
    get_invalid_uuid_data,
    get_empty_string_data,
    get_invalid_date_data,
)

def test_user_validation_success():
    """
    Tests that a valid user object is successfully validated.
    """
    user_data = get_valid_user_data()
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
    user_data = get_valid_user_data()
    user_data["updated_at"] = None
    user = User(**user_data)
    assert user.updated_at is None

def test_user_validation_invalid_id():
    """
    Tests that a user object with an invalid id raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(**get_invalid_uuid_data(get_valid_user_data(), "id"))

def test_user_validation_empty_name():
    """
    Tests that a user object with an empty name raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(**get_empty_string_data(get_valid_user_data(), "name"))


def test_user_validation_whitespace_name():
    """Tests that a user object with a whitespace-only name raises a validation error."""
    user_data = get_valid_user_data()
    user_data["name"] = "   "
    with pytest.raises(ValidationError):
        User(**user_data)

def test_user_validation_invalid_email():
    """
    Tests that a user object with an invalid email raises a validation error.
    """
    user_data = get_valid_user_data()
    user_data["email"] = "not-an-email"
    with pytest.raises(ValidationError):
        User(**user_data)

def test_user_validation_invalid_created_at():
    """
    Tests that a user object with an invalid created_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(**get_invalid_date_data(get_valid_user_data(), "created_at"))

def test_user_validation_invalid_updated_at():
    """
    Tests that a user object with an invalid updated_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        User(**get_invalid_date_data(get_valid_user_data(), "updated_at"))
