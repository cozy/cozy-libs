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
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}

module.exports = config
