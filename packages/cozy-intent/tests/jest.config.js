// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: ['./**/*.{ts,tsx}'],
  coverageDirectory: './tests/coverage',
  coveragePathIgnorePatterns: ['./tests'],
  moduleNameMapper: {
    '@api(.*)$': '<rootDir>/src/api/$1',
    '@tests(.*)$': '<rootDir>/tests/$1',
    '@utils(.*)$': '<rootDir>/src/utils/$1',
    '@view(.*)$': '<rootDir>/src/view/$1'
  },
  rootDir: '../',
  testMatch: ['./**/*.spec.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}

module.exports = config
