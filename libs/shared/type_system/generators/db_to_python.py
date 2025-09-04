from typing import Dict, Any, Optional
import json
import os

class DbToPython:
    def generate(self, schema_path: str, output_dir: Optional[str] = None) -> Dict[str, Dict[str, str]]:
        """Generate Python types from database schema and optionally write to files."""
        schema = self._parse_schema(schema_path)
        types = self._generate_types(schema)

        if output_dir:
            self._write_types_to_files(types, output_dir)

        return types

    def _write_types_to_files(self, types: Dict[str, Dict[str, str]], output_dir: str):
        """Write generated Python types to individual files."""
        os.makedirs(output_dir, exist_ok=True)

        for class_name, fields in types.items():
            filename = f"{class_name.lower()}.py"
            filepath = os.path.join(output_dir, filename)

            with open(filepath, 'w') as f:
                f.write(f"# Auto-generated Python types for {class_name}\n")
                f.write("from typing import Optional, List\n")
                f.write("from uuid import UUID\n")
                f.write("from datetime import datetime, date, time\n\n")
                f.write(f"class {class_name}:\n")
                f.write("    \"\"\"Database model type definitions.\"\"\"\n\n")

                for field_name, field_type in fields.items():
                    f.write(f"    {field_name}: {field_type}\n")

                f.write("\n    def __init__(self, **kwargs):\n")
                f.write("        for key, value in kwargs.items():\n")
                f.write("            setattr(self, key, value)\n")

    def _parse_schema(self, schema_path: str) -> Dict[str, Any]:
        """Parse database schema file."""
        with open(schema_path, 'r') as f:
            return json.load(f)

    def _generate_types(self, schema: Dict[str, Any]) -> Dict[str, Dict[str, str]]:
        """Generate Python type definitions from schema."""
        types: Dict[str, Dict[str, str]] = {}
        for table_name, table_def in schema["tables"].items():
            class_name = table_name.capitalize()
            fields: Dict[str, str] = {}
            for col_name, col_def in table_def["columns"].items():
                python_type = self.map_postgres_to_python(
                    col_def["type"],
                    col_def.get("nullable", False),
                    col_def.get("is_array", False)
                )
                fields[col_name] = python_type
            types[class_name] = fields
        return types

    def map_postgres_to_python(
        self,
        postgres_type: str,
        nullable: bool = False,
        is_array: bool = False
    ) -> str:
        type_map = {
            'uuid': 'UUID',
            'bigint': 'int',
            'timestamptz': 'datetime',
            'timestamp': 'datetime',
            'date': 'date',
            'time': 'time',
            'integer': 'int',
            'smallint': 'int',
            'bigserial': 'int',
            'serial': 'int',
            'boolean': 'bool',
            'text': 'str',
            'varchar': 'str',
            'char': 'str',
            'numeric': 'float',
            'decimal': 'float',
            'double': 'float',
            'real': 'float',
            'json': 'dict',
            'jsonb': 'dict',
            'bytea': 'bytes',
        }

        base_type = type_map.get(postgres_type.lower(), 'Any')

        if is_array:
            base_type = f'List[{base_type}]'

        if nullable:
            base_type = f'Optional[{base_type}]'

        return base_type


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python db_to_python.py <schema_path> [output_dir]")
        sys.exit(1)

    schema_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    generator = DbToPython()
    generator.generate(schema_path, output_dir)

    if output_dir:
        print(f"Python types generated successfully in {output_dir}")
    else:
        print("Python types generated successfully (no output directory specified)")

