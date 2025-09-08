import json
import subprocess
import pytest
from pydantic import ValidationError
from libs.backend.type_utils.validators.user import User as PydanticUser

def run_ts_validator(data):
    """
    Runs the TypeScript validator script with the given data.
    """
    process = subprocess.run(
        ['npx', 'ts-node', 'tests/cross/validate_user.ts'],
        input=json.dumps(data),
        capture_output=True,
        text=True,
    )
    return process.stdout.strip() == 'true'

def get_test_cases():
    """
    Loads the test cases from the JSON file.
    """
    with open('tests/cross/user_test_cases.json', 'r') as f:
        return json.load(f)

@pytest.mark.parametrize("test_case", get_test_cases())
def test_validation_parity(test_case):
    """
    Tests that the Python and TypeScript validators have the same behavior.
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
    ts_is_valid = run_ts_validator(data)

    assert python_is_valid == expected_valid, f"Python validation failed for: {description}"
    assert ts_is_valid == expected_valid, f"TypeScript validation failed for: {description}"
    assert python_is_valid == ts_is_valid, f"Parity failed for: {description}"
