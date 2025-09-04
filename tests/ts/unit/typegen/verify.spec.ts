import { verifyTypeParity } from '../../../../tools/type-generator/src/generators/verify';

describe('Type Parity Verification', () => {
  it('should detect mismatched nullability', () => {
    const tsType = 'string | null';
    const pyType = 'str';
    const result = verifyTypeParity(tsType, pyType);
    expect(result).toBe(false);
  });

  it('should detect type drift', () => {
    const tsType = 'string';
    const pyType = 'int';
    const result = verifyTypeParity(tsType, pyType);
    expect(result).toBe(false);
  });

  it('should pass for matching types', () => {
    const tsType = 'string';
    const pyType = 'str';
    const result = verifyTypeParity(tsType, pyType);
    expect(result).toBe(true);
  });

  it('should handle nullable types correctly', () => {
    const tsType = 'string | null';
    const pyType = 'Optional[str]';
    const result = verifyTypeParity(tsType, pyType);
    expect(result).toBe(true);
  });

  it('should handle array types', () => {
    const tsType = 'string[]';
    const pyType = 'List[str]';
    const result = verifyTypeParity(tsType, pyType);
    expect(result).toBe(true);
  });
});
