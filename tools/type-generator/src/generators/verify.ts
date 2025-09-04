export function verifyTypeParity(tsType: string, pyType: string): boolean {
  // Normalize TypeScript type
  const normalizedTsType = tsType.replace(/\s+/g, '').toLowerCase();

  // Normalize Python type
  const normalizedPyType = pyType.replace(/\s+/g, '').toLowerCase();

  // Check if TypeScript type is nullable
  const isTsNullable = normalizedTsType.includes('|null');

  // Check if Python type is optional
  const isPyOptional = normalizedPyType.includes('optional[');

  // If one is nullable/optional and the other is not, they don't match
  if (isTsNullable !== isPyOptional) {
    return false;
  }

  // If both are nullable/optional, check the base types
  if (isTsNullable && isPyOptional) {
    const tsBase = normalizedTsType.replace('|null', '');
    const pyBase = normalizedPyType.replace('optional[', '').replace(']', '');
    return verifyTypeParity(tsBase, pyBase);
  }

  // Mapping between TypeScript and Python types for non-nullable cases
  const typeMapping: Record<string, string[]> = {
    string: ['str', 'uuid', 'datetime', 'date', 'time', 'bytes'],
    number: ['int', 'float'],
    boolean: ['bool'],
    unknown: ['dict', 'any'],
    null: ['none']
  };

  // Check for direct mapping
  for (const [tsKey, pyValues] of Object.entries(typeMapping)) {
    if (normalizedTsType.includes(tsKey) && pyValues.some(pyVal => normalizedPyType.includes(pyVal))) {
      return true;
    }
  }

  // Check for array types
  if (normalizedTsType.includes('[]') && normalizedPyType.includes('list[')) {
    const tsBase = normalizedTsType.replace('[]', '');
    const pyBase = normalizedPyType.replace('list[', '').replace(']', '');
    return verifyTypeParity(tsBase, pyBase);
  }

  // Check for union types (simplified)
  if (normalizedTsType.includes('|') && normalizedPyType.includes('union[')) {
    // For simplicity, we'll just check if both sides have similar structure
    // This could be enhanced with more sophisticated parsing
    const tsTypes = normalizedTsType.split('|');
    const pyTypes = normalizedPyType.replace('union[', '').replace(']', '').split(',');
    return tsTypes.length === pyTypes.length;
  }

  return false;
}
