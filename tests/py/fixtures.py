"""Common test fixtures for validation parity tests."""

from datetime import datetime, timezone
from typing import Any, Dict
from uuid import UUID, uuid4


def _timestamp() -> datetime:
    """Return a timezone-aware timestamp with millisecond precision."""
    return datetime.now(timezone.utc).replace(microsecond=0)


def _new_uuid() -> UUID:
    """Generate a UUID helper to keep fixtures readable."""
    return uuid4()


def get_valid_user_data() -> Dict[str, Any]:
    """Return valid user data backed by strong types."""
    timestamp = _timestamp()
    return {
        "id": _new_uuid(),
        "name": "Test User",
        "email": "test@example.com",
        "created_at": timestamp,
        "updated_at": timestamp,
    }


def get_valid_post_data() -> Dict[str, Any]:
    """Return valid post data backed by strong types."""
    timestamp = _timestamp()
    return {
        "id": _new_uuid(),
        "user_id": _new_uuid(),
        "title": "Test Post",
        "content": "This is a test post content.",
        "published": True,
        "created_at": timestamp,
        "updated_at": timestamp,
    }


def get_valid_comment_data() -> Dict[str, Any]:
    """Return valid comment data backed by strong types."""
    return {
        "id": _new_uuid(),
        "post_id": _new_uuid(),
        "user_id": _new_uuid(),
        "content": "This is a test comment.",
        "created_at": _timestamp(),
    }


def get_invalid_uuid_data(valid_data: Dict[str, Any], field: str) -> Dict[str, Any]:
    """Return data with an invalid UUID for the specified field."""
    data = valid_data.copy()
    data[field] = "not-a-uuid"
    return data


def get_empty_string_data(valid_data: Dict[str, Any], field: str) -> Dict[str, Any]:
    """Return data with an empty string for the specified field."""
    data = valid_data.copy()
    data[field] = ""
    return data


def get_whitespace_only_data(valid_data: Dict[str, Any], field: str) -> Dict[str, Any]:
    """Return data with whitespace-only content for the specified field."""
    data = valid_data.copy()
    data[field] = "   "
    return data


def get_invalid_date_data(valid_data: Dict[str, Any], field: str) -> Dict[str, Any]:
    """Return data with an invalid date format for the specified field."""
    data = valid_data.copy()
    data[field] = "invalid-date"
    return data


def get_non_boolean_data(valid_data: Dict[str, Any], field: str) -> Dict[str, Any]:
    """Return data with a non-boolean value for the specified field."""
    data = valid_data.copy()
    data[field] = "true"
    return data


def get_null_content_data(valid_data: Dict[str, Any]) -> Dict[str, Any]:
    """Return data with null content (and updated_at) for posts."""
    data = valid_data.copy()
    data["content"] = None
    data["updated_at"] = None
    return data


def get_null_updated_at_data(valid_data: Dict[str, Any]) -> Dict[str, Any]:
    """Return data with null updated_at for users and posts."""
    data = valid_data.copy()
    data["updated_at"] = None
    return data
