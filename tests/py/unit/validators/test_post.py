import pytest
from pydantic import ValidationError

from libs.backend.type_utils.validators.post import Post
from tests.py.fixtures import (
    get_valid_post_data,
    get_invalid_uuid_data,
    get_empty_string_data,
    get_null_content_data,
    get_non_boolean_data,
    get_invalid_date_data,
    get_whitespace_only_data,
)

def test_post_validation_success():
    """
    Tests that a valid post object is successfully validated.
    """
    post_data = get_valid_post_data()
    post: Post = Post(**post_data)
    assert post.id == post_data["id"]
    assert post.user_id == post_data["user_id"]
    assert post.title == post_data["title"]
    assert post.content == post_data["content"]
    assert post.published == post_data["published"]
    assert post.created_at == post_data["created_at"]
    assert post.updated_at == post_data["updated_at"]

def test_post_validation_content_none():
    """
    Tests that a valid post object with content as None is successfully validated.
    """
    post_data = get_null_content_data(get_valid_post_data())
    post: Post = Post(**post_data)
    assert post.content is None
    assert post.updated_at is None

def test_post_validation_invalid_id():
    """
    Tests that a post object with an invalid id raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_invalid_uuid_data(get_valid_post_data(), "id"))

def test_post_validation_invalid_user_id():
    """
    Tests that a post object with an invalid user_id raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_invalid_uuid_data(get_valid_post_data(), "user_id"))


def test_post_validation_whitespace_title():
    """Tests that a post object with a whitespace-only title raises a validation error."""
    post_data = get_valid_post_data()
    post_data["title"] = "   "
    with pytest.raises(ValidationError):
        Post(**post_data)

def test_post_validation_empty_title():
    """
    Tests that a post object with an empty title raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_empty_string_data(get_valid_post_data(), "title"))

def test_post_validation_invalid_published():
    """
    Tests that a post object with an invalid published type raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_non_boolean_data(get_valid_post_data(), "published"))


def test_post_validation_whitespace_content():
    """Tests that a post object with whitespace-only content raises a validation error."""
    with pytest.raises(ValidationError):
        Post(**get_whitespace_only_data(get_valid_post_data(), "content"))

def test_post_validation_invalid_created_at():
    """
    Tests that a post object with an invalid created_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_invalid_date_data(get_valid_post_data(), "created_at"))

def test_post_validation_invalid_updated_at():
    """
    Tests that a post object with an invalid updated_at raises a validation error.
    """
    with pytest.raises(ValidationError):
        Post(**get_invalid_date_data(get_valid_post_data(), "updated_at"))
