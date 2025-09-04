"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbToTypeScript = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class DbToTypeScript {
    generate(schemaPath, outputDir) {
        const schema = this._parseSchema(schemaPath);
        const types = this._generateTypes(schema);
        if (outputDir) {
            this._writeTypesToFiles(types, outputDir);
        }
        return types;
    }
    _parseSchema(schemaPath) {
        const content = (0, fs_1.readFileSync)(schemaPath, 'utf-8');
        return JSON.parse(content);
    }
    _generateTypes(schema) {
        const types = {};
        for (const [tableName, tableDef] of Object.entries(schema.tables)) {
            const className = tableName.charAt(0).toUpperCase() + tableName.slice(1);
            const fields = {};
            for (const [colName, colDef] of Object.entries(tableDef.columns)) {
                const columnDef = colDef;
                const tsType = this.mapPostgresToTypeScript(columnDef.type, columnDef.nullable || false, columnDef.is_array || false);
                fields[colName] = tsType;
            }
            types[className] = fields;
        }
        return types;
    }
    _writeTypesToFiles(types, outputDir) {
        if (!(0, fs_1.existsSync)(outputDir)) {
            (0, fs_1.mkdirSync)(outputDir, { recursive: true });
        }
        for (const [className, fields] of Object.entries(types)) {
            const filename = `${className.toLowerCase()}.ts`;
            const filepath = (0, path_1.join)(outputDir, filename);
            let content = `// Auto-generated TypeScript types for ${className}\n`;
            content += `export interface ${className} {\n`;
            for (const [fieldName, fieldType] of Object.entries(fields)) {
                content += `  ${fieldName}: ${fieldType};\n`;
            }
            content += '}\n\n';
            (0, fs_1.writeFileSync)(filepath, content, 'utf-8');
        }
    }
    mapPostgresToTypeScript(postgresType, nullable = false, isArray = false) {
        const typeMap = {
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
exports.DbToTypeScript = DbToTypeScript;
