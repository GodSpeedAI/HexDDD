import type { Config } from 'jest';

const config: Config = {
  displayName: 'web-expo',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    // eslint-disable-next-line no-useless-escape
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
};

export default config;

