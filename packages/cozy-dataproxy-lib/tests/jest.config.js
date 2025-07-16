// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.{ts,tsx}'],
  coverageDirectory: './tests/coverage',
  coveragePathIgnorePatterns: [
    './tests',
    './src/search/@types/*',
    './src/search/types.ts',
    './src/search/helpers/getSearchEncoder.ts'
  ],
  transformIgnorePatterns: ['node_modules/(?!(flexsearch)/)'],
  rootDir: '../',
  testMatch: ['./**/*.spec.{ts,tsx,js}'],
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
