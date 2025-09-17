import pytest
from pydantic import ValidationError

from libs.backend.type_utils.validators.comment import Comment
from tests.py.fixtures import (
    get_valid_comment_data,
    get_invalid_uuid_data,
    get_empty_string_data,
    get_whitespace_only_data,
    get_invalid_date_data,
)

def test_comment_validation_success():
    """
    Tests that a valid comment object is successfully validated.
    """
    comment_data = get_valid_comment_data()
    comment = Comment(**comment_data)
    assert comment.id == comment_data["id"]
    assert comment.post_id == comment_data["post_id"]
    assert comment.user_id == comment_data["user_id"]
    assert comment.content == comment_data["content"]
    assert comment.created_at == comment_data["created_at"]

def test_comment_validation_invalid_id():
    """
    Tests that a comment object with an invalid id raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_invalid_uuid_data(get_valid_comment_data(), "id"))

def test_comment_validation_invalid_post_id():
    """
    Tests that a comment object with an invalid post_id raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_invalid_uuid_data(get_valid_comment_data(), "post_id"))

def test_comment_validation_invalid_user_id():
    """
    Tests that a comment object with an invalid user_id raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_invalid_uuid_data(get_valid_comment_data(), "user_id"))

def test_comment_validation_empty_content():
    """
    Tests that a comment object with an empty content raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_empty_string_data(get_valid_comment_data(), "content"))

def test_comment_validation_whitespace_only_content():
    """
    Tests that a comment object with whitespace-only content raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_whitespace_only_data(get_valid_comment_data(), "content"))

def test_comment_validation_invalid_created_at():
    """
    Tests that a comment object with an invalid created_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        Comment(**get_invalid_date_data(get_valid_comment_data(), "created_at"))
