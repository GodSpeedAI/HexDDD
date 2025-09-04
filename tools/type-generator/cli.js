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
  .option('-f, --fix', 'auto-fix simple naming mismatches by renaming Python fields to match TypeScript')
  .action((tsDir, pyDir, options) => {
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
    const pyFileContents = {};

    pyFiles.forEach(file => {
      const content = readFileSync(join(pyDir, file), 'utf-8');
      pyFileContents[file] = content;
      const classMatch = content.match(/class (\w+):\s*""".*?"""\s*((?:\s*\w+:\s*[^\n]+\s*)*)/);
      if (classMatch) {
        const className = classMatch[1];
        const fields = {};
        const fieldLines = classMatch[2].trim().split('\n');
        fieldLines.forEach(line => {
          const fieldMatch = line.trim().match(/(\w+):\s*([^\n]+)/);
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
          // Attempt auto-fix: if --fix and Python has the snake_case form, rename it to TS fieldName
          if (options.fix) {
            const pyFile = join(pyDir, `${className.toLowerCase()}.py`);
            if (require('fs').existsSync(pyFile)) {
              let content = pyFileContents[`${className.toLowerCase()}.py`];
              // Replace the field definition line preserving type
              const pyType = pyClass[pythonFieldName];
              if (pyType) {
                const fieldDefRegex = new RegExp(`(^|\n)(\s*)${pythonFieldName}:\s*[^\n]+`);
                if (fieldDefRegex.test(content)) {
                  content = content.replace(fieldDefRegex, (m, p1, indent) => `${p1}${indent}${fieldName}: ${pyType}`);
                  require('fs').writeFileSync(pyFile, content, 'utf-8');
                  // Reflect change in memory for subsequent checks
                  pyFileContents[`${className.toLowerCase()}.py`] = content;
                  pyClass[fieldName] = pyType;
                  delete pyClass[pythonFieldName];
                  console.log(`🛠  Auto-fixed field name in ${className}: ${pythonFieldName} -> ${fieldName}`);
                  hasErrors = false; // this specific error fixed
                }
              }
            }
          }
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
        // Accept either exact snake_case or camelCase in TS
        const camelCaseName = snakeToCamel(fieldName);
        const existsInTs = tsClass[camelCaseName] || tsClass[fieldName];

        if (!existsInTs) {
          console.error(`❌ Extra field in Python ${className}: ${fieldName} (expected ${camelCaseName} or ${fieldName} in TypeScript)`);
          hasErrors = true;
        } else if (options.fix && tsClass[camelCaseName] && !tsClass[fieldName]) {
          // If TS prefers camelCase and Python has snake_case, rename Python field to camelCase
          const pyFile = join(pyDir, `${className.toLowerCase()}.py`);
          if (require('fs').existsSync(pyFile)) {
            let content = pyFileContents[`${className.toLowerCase()}.py`];
            const pyType = pyClass[fieldName];
            const fieldDefRegex = new RegExp(`(^|\n)(\s*)${fieldName}:\s*[^\n]+`);
            if (fieldDefRegex.test(content)) {
              content = content.replace(fieldDefRegex, (m, p1, indent) => `${p1}${indent}${camelCaseName}: ${pyType}`);
              require('fs').writeFileSync(pyFile, content, 'utf-8');
              pyFileContents[`${className.toLowerCase()}.py`] = content;
              pyClass[camelCaseName] = pyType;
              delete pyClass[fieldName];
              console.log(`🛠  Auto-fixed field name in ${className}: ${fieldName} -> ${camelCaseName}`);
            }
          }
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
