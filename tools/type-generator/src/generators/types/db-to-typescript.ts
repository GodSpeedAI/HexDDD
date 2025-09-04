import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export class DbToTypeScript {
  generate(schemaPath: string, outputDir?: string): Record<string, Record<string, string>> {
    const schema = this._parseSchema(schemaPath);
    const types = this._generateTypes(schema);

    if (outputDir) {
      this._writeTypesToFiles(types, outputDir);
    }

    return types;
  }

  private _parseSchema(schemaPath: string): any {
    const content = readFileSync(schemaPath, 'utf-8');
    return JSON.parse(content);
  }

  private _generateTypes(schema: any): Record<string, Record<string, string>> {
    const types: Record<string, Record<string, string>> = {};

    for (const [tableName, tableDef] of Object.entries(schema.tables)) {
      const className = tableName.charAt(0).toUpperCase() + tableName.slice(1);
      const fields: Record<string, string> = {};

      for (const [colName, colDef] of Object.entries((tableDef as any).columns)) {
        const columnDef = colDef as any;
        const tsType = this.mapPostgresToTypeScript(
          columnDef.type,
          columnDef.nullable || false,
          columnDef.is_array || false
        );
        fields[colName] = tsType;
      }

      types[className] = fields;
    }

    return types;
  }

  private _writeTypesToFiles(types: Record<string, Record<string, string>>, outputDir: string): void {
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    for (const [className, fields] of Object.entries(types)) {
      const filename = `${className.toLowerCase()}.ts`;
      const filepath = join(outputDir, filename);

      let content = `// Auto-generated TypeScript types for ${className}\n`;
      content += `export interface ${className} {\n`;

      for (const [fieldName, fieldType] of Object.entries(fields)) {
        content += `  ${fieldName}: ${fieldType};\n`;
      }

      content += '}\n\n';

      writeFileSync(filepath, content, 'utf-8');
    }
  }

  mapPostgresToTypeScript(
    postgresType: string,
    nullable: boolean = false,
    isArray: boolean = false
  ): string {
    const typeMap: Record<string, string> = {
      uuid: 'string',
      bigint: 'string',
      timestamptz: 'string',
      timestamp: 'string',
      date: 'string',
      time: 'string',
      integer: 'number',
      smallint: 'number',
      bigserial: 'string',
      serial: 'number',
      boolean: 'boolean',
      text: 'string',
      varchar: 'string',
      char: 'string',
      numeric: 'number',
      decimal: 'number',
      double: 'number',
      real: 'number',
      json: 'unknown',
      jsonb: 'unknown',
      bytea: 'string',
    };

    let baseType = typeMap[postgresType.toLowerCase()] || 'unknown';

    if (isArray) {
      baseType = `${baseType}[]`;
    }

    if (nullable) {
      baseType = `${baseType} | null`;
    }

    return baseType;
  }
}
