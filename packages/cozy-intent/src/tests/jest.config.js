// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: ['./**/*.{ts,tsx}'],
  coverageDirectory: './tests/coverage',
  coveragePathIgnorePatterns: ['./tests'],
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
