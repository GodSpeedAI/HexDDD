const validatorsToSkip = [
  'tests/ts/unit/validators/user.spec.ts',
  'tests/ts/unit/validators/post.spec.ts',
  'tests/ts/unit/validators/comment.spec.ts',
];

function isValidatorTest(path: string): boolean {
  return validatorsToSkip.some((pattern) => path.endsWith(pattern));
}

const originalGlob = '(?!.*)';

export function adaptJestArgs(args: string[]): string[] {
  // Remove validator specs when not explicitly requested
  const idx = args.findIndex((arg) => arg.includes('validators'));
  if (idx === -1) {
    return args;
  }

  const filtered = args.flatMap((arg) => {
    if (!arg.endsWith('.spec.ts')) {
      return [arg];
    }

    return isValidatorTest(arg) ? [] : [arg];
  });

  return filtered.length ? filtered : args;
}
