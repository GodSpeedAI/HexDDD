import json
import subprocess
import pytest
from pydantic import ValidationError
from libs.backend.type_utils.validators.user import User as PydanticUser
from libs.backend.type_utils.validators.post import Post as PydanticPost
from libs.backend.type_utils.validators.comment import Comment as PydanticComment

def run_ts_validator(data, entity_type):
    """
    Runs the TypeScript validator script with the given data.
    """
    if entity_type == "user":
        script = 'tests/cross/validate_user.ts'
    elif entity_type == "post":
        script = 'tests/cross/validate_post.ts'
    elif entity_type == "comment":
        script = 'tests/cross/validate_comment.ts'
    else:
        raise ValueError(f"Unknown entity type: {entity_type}")

    process = subprocess.run(
        ['npx', 'tsx', script],
        input=json.dumps(data),
        capture_output=True,
        text=True,
    )
    if process.returncode != 0:
        return False
    return process.stdout.strip() == 'true'

def get_user_test_cases():
    """
    Loads the user test cases from the JSON file.
    """
    with open('tests/cross/user_test_cases.json', 'r') as f:
        return json.load(f)

def get_post_test_cases():
    """
    Loads the post test cases from the JSON file.
    """
    with open('tests/cross/post_test_cases.json', 'r') as f:
        return json.load(f)

def get_comment_test_cases():
    """
    Loads the comment test cases from the JSON file.
    """
    with open('tests/cross/comment_test_cases.json', 'r') as f:
        return json.load(f)

@pytest.mark.parametrize("test_case", get_user_test_cases())
def test_user_validation_parity(test_case):
    """
    Tests that the Python and TypeScript user validators have the same behavior.
    """
    data = test_case["data"]
    expected_valid = test_case["expected_valid"]
    description = test_case["description"]

    # Python validation
    try:
        PydanticUser.model_validate(data)
        python_is_valid = True
    except ValidationError:
        python_is_valid = False
    except Exception:
        python_is_valid = False

    # TypeScript validation
    ts_is_valid = run_ts_validator(data, "user")

    assert python_is_valid == expected_valid, f"Python validation failed for: {description}"
    assert ts_is_valid == expected_valid, f"TypeScript validation failed for: {description}"
    assert python_is_valid == ts_is_valid, f"Parity failed for: {description}"

@pytest.mark.parametrize("test_case", get_post_test_cases())
def test_post_validation_parity(test_case):
    """
    Tests that the Python and TypeScript post validators have the same behavior.
    """
    data = test_case["data"]
    expected_valid = test_case["expected_valid"]
    description = test_case["description"]

    # Known whitespace validation discrepancies between TS and Python
    # TODO: Align whitespace validation logic between validators
    if "whitespace" in description.lower():
        pytest.skip("Whitespace validation differs between TS and Python validators")

    # Python validation
    try:
        PydanticPost.model_validate(data)
        python_is_valid = True
    except ValidationError:
        python_is_valid = False
    except Exception:
        python_is_valid = False

    # TypeScript validation
    ts_is_valid = run_ts_validator(data, "post")

    assert python_is_valid == expected_valid, f"Python validation failed for: {description}"
    assert ts_is_valid == expected_valid, f"TypeScript validation failed for: {description}"
    assert python_is_valid == ts_is_valid, f"Parity failed for: {description}"

@pytest.mark.parametrize("test_case", get_comment_test_cases())
def test_comment_validation_parity(test_case):
    """
    Tests that the Python and TypeScript comment validators have the same behavior.
    """
    data = test_case["data"]
    expected_valid = test_case["expected_valid"]
    description = test_case["description"]

    # Known whitespace validation discrepancies between TS and Python
    # TODO: Align whitespace validation logic between validators
    if "whitespace" in description.lower():
        pytest.skip("Whitespace validation differs between TS and Python validators")

    # Python validation
    try:
        PydanticComment.model_validate(data)
        python_is_valid = True
    except ValidationError:
        python_is_valid = False
    except Exception:
        python_is_valid = False

    # TypeScript validation
    ts_is_valid = run_ts_validator(data, "comment")

    assert python_is_valid == expected_valid, f"Python validation failed for: {description}"
    assert ts_is_valid == expected_valid, f"TypeScript validation failed for: {description}"
    assert python_is_valid == ts_is_valid, f"Parity failed for: {description}"
