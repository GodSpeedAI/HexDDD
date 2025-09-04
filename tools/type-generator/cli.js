#!/usr/bin/env node

const { program } = require('commander');
const { DbToTypeScript } = require('./dist/generators/types/db-to-typescript');
const { verifyTypeParity } = require('./dist/generators/verify');
const { readFileSync } = require('fs');
const { join } = require('path');

program
  .name('typegen')
  .description('TypeScript and Python type generator from database schema')
  .version('0.0.1');

program
  .command('generate')
  .description('Generate TypeScript types from database schema')
  .argument('<schema-path>', 'path to the database schema JSON file')
  .option('-o, --output-dir <dir>', 'output directory for generated types')
  .action((schemaPath, options) => {
    const generator = new DbToTypeScript();
    generator.generate(schemaPath, options.outputDir);
    console.log('TypeScript types generated successfully');
  });

program
  .command('verify')
  .description('Verify structural parity between TypeScript and Python types')
  .argument('<ts-dir>', 'directory containing TypeScript type files')
  .argument('<py-dir>', 'directory containing Python type files')
  .action((tsDir, pyDir) => {
    console.log('Verifying type parity between TypeScript and Python...');

    // Read TypeScript files
    const tsFiles = require('fs').readdirSync(tsDir).filter(file => file.endsWith('.ts'));
    const tsTypes = {};

    tsFiles.forEach(file => {
      const content = readFileSync(join(tsDir, file), 'utf-8');
      const interfaceMatch = content.match(/export interface (\w+) {([^}]*)}/);
      if (interfaceMatch) {
        const className = interfaceMatch[1];
        const fields = {};
        const fieldLines = interfaceMatch[2].trim().split('\n');
        fieldLines.forEach(line => {
          const fieldMatch = line.trim().match(/(\w+):\s*(.+);/);
          if (fieldMatch) {
            fields[fieldMatch[1]] = fieldMatch[2].trim();
          }
        });
        tsTypes[className] = fields;
      }
    });

    // Read Python files
    const pyFiles = require('fs').readdirSync(pyDir).filter(file => file.endsWith('.py'));
    const pyTypes = {};

    pyFiles.forEach(file => {
      const content = readFileSync(join(pyDir, file), 'utf-8');
      const classMatch = content.match(/class (\w+):\s*""".*?"""\s*((?:\s*\w+:\s*[^\n]+\s*)*)/);
      if (classMatch) {
        const className = classMatch[1];
        const fields = {};
        const fieldLines = classMatch[2].trim().split('\n');
        fieldLines.forEach(line => {
          const fieldMatch = line.trim().match(/(\w+):\s*(.+)/);
          if (fieldMatch) {
            fields[fieldMatch[1]] = fieldMatch[2].trim();
          }
        });
        pyTypes[className] = fields;
      }
    });

    // Helper function to convert snake_case to camelCase
    function snakeToCamel(str) {
      return str.replace(/(_\w)/g, match => match[1].toUpperCase());
    }

    // Compare structures
    let hasErrors = false;

    Object.keys(tsTypes).forEach(className => {
      if (!pyTypes[className]) {
        console.error(`❌ Missing Python class: ${className}`);
        hasErrors = true;
        return;
      }

      const tsClass = tsTypes[className];
      const pyClass = pyTypes[className];

      Object.keys(tsClass).forEach(fieldName => {
        // Convert Python field names from snake_case to camelCase for comparison
        const pythonFieldName = fieldName.replace(/([A-Z])/g, '_$1').toLowerCase();

        if (!pyClass[pythonFieldName]) {
          console.error(`❌ Missing field in Python ${className}: ${fieldName} (expected ${pythonFieldName} in Python)`);
          hasErrors = true;
          return;
        }

        const tsType = tsClass[fieldName];
        const pyType = pyClass[pythonFieldName];

        if (!verifyTypeParity(tsType, pyType)) {
          console.error(`❌ Type mismatch in ${className}.${fieldName}: TS=${tsType}, Python=${pyType}`);
          hasErrors = true;
        }
      });

      // Check for extra fields in Python
      Object.keys(pyClass).forEach(fieldName => {
        // Convert Python field names from snake_case to camelCase for comparison
        const typescriptFieldName = snakeToCamel(fieldName);

        if (!tsClass[typescriptFieldName]) {
          console.error(`❌ Extra field in Python ${className}: ${fieldName} (would be ${typescriptFieldName} in TypeScript)`);
          hasErrors = true;
        }
      });
    });

    // Check for missing TypeScript classes
    Object.keys(pyTypes).forEach(className => {
      if (!tsTypes[className]) {
        console.error(`❌ Missing TypeScript class: ${className}`);
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      console.log('✅ All types are structurally compatible');
    } else {
      process.exit(1);
    }
  });

program.parse();
