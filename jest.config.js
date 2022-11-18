module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/scripts/test-setup.ts'],
}
