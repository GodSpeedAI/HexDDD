export declare class DbToTypeScript {
    generate(schemaPath: string, outputDir?: string): Record<string, Record<string, string>>;
    private _parseSchema;
    private _generateTypes;
    private _writeTypesToFiles;
    mapPostgresToTypeScript(postgresType: string, nullable?: boolean, isArray?: boolean): string;
}
