module.exports = {
  testMatch: [
    '**/tests/ts/unit/typegen/**/*.spec.ts',
    '**/tests/ts/unit/typegen/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/../../..'], // Set root to workspace root to access tests directory
};
