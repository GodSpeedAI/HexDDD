"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPostgresToTypeScript = void 0;
function mapPostgresToTypeScript(postgresType, nullable = false, isArray = false) {
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
exports.mapPostgresToTypeScript = mapPostgresToTypeScript;
