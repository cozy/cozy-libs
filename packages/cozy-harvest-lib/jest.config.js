module.exports = {
  browser: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  roots: ['src'],
  resolver: 'jest-resolve-cached',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '^cozy-logger$': 'cozy-logger/dist/index.js',
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    // Force cozy-client resolving to use harvest's version of cozy-client
    // Can be removed when cozy-client's version in the workspace is > 14.4.0.
    // Since otherwise harvest tries to mock unexisting methods from
    // cozy-client/models/account (getContractSyncStatusFromAccount for ex)
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index.js'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-keys-lib))'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js']
}
