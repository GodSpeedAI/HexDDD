import sys
import os
import tempfile
import json

# Add the libs directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../..'))

from libs.shared.type_system.generators.db_to_python import DbToPython

def test_map_uuid_to_uuid():
    generator = DbToPython()
    result = generator.map_postgres_to_python('uuid')
    assert result == 'UUID'

def test_map_bigint_to_int():
    generator = DbToPython()
    result = generator.map_postgres_to_python('bigint')
    assert result == 'int'

def test_map_timestamptz_to_datetime():
    generator = DbToPython()
    result = generator.map_postgres_to_python('timestamptz')
    assert result == 'datetime'

def test_map_integer_to_int():
    generator = DbToPython()
    result = generator.map_postgres_to_python('integer')
    assert result == 'int'

def test_map_boolean_to_bool():
    generator = DbToPython()
    result = generator.map_postgres_to_python('boolean')
    assert result == 'bool'

def test_map_text_to_str():
    generator = DbToPython()
    result = generator.map_postgres_to_python('text')
    assert result == 'str'

def test_map_nullable_types_with_optional():
    generator = DbToPython()
    result = generator.map_postgres_to_python('uuid', True)
    assert result == 'Optional[UUID]'

def test_map_array_types_with_list():
    generator = DbToPython()
    result = generator.map_postgres_to_python('uuid', False, True)
    assert result == 'List[UUID]'

def test_map_nullable_array_types():
    generator = DbToPython()
    result = generator.map_postgres_to_python('uuid', True, True)
    assert result == 'Optional[List[UUID]]'

def test_generate_types_from_schema():
    generator = DbToPython()

    # Create a temporary schema file
    schema_data = {
        "tables": {
            "users": {
                "columns": {
                    "id": {"type": "uuid", "nullable": False},
                    "name": {"type": "text", "nullable": False}
                }
            }
        }
    }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(schema_data, f)
        schema_path = f.name

    try:
        types = generator.generate(schema_path)
        assert 'Users' in types
        assert types['Users']['id'] == 'UUID'
        assert types['Users']['name'] == 'str'
    finally:
        os.unlink(schema_path)

def test_generate_types_with_file_output():
    generator = DbToPython()

    # Create a temporary schema file
    schema_data = {
        "tables": {
            "users": {
                "columns": {
                    "id": {"type": "uuid", "nullable": False},
                    "name": {"type": "text", "nullable": False}
                }
            }
        }
    }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(schema_data, f)
        schema_path = f.name

    try:
        with tempfile.TemporaryDirectory() as output_dir:
            types = generator.generate(schema_path, output_dir)

            # Check that files were created
            users_file = os.path.join(output_dir, 'users.py')
            assert os.path.exists(users_file)

            # Check file content
            with open(users_file, 'r') as f:
                content = f.read()
                assert 'class Users:' in content
                assert 'id: UUID' in content
                assert 'name: str' in content
                assert 'from typing import Optional, List' in content
                assert 'from uuid import UUID' in content
    finally:
        os.unlink(schema_path)
