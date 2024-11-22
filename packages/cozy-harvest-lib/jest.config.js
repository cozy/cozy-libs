module.exports = {
  browser: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  roots: ['src'],
  resolver: 'jest-resolve-cached',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '^cozy-logger$': 'cozy-logger/dist/index.js',
    '\\.(png|gif|jpe?g|svg|css)$': '<rootDir>/src/__mocks__/fileMock.js',
    // identity-obj-proxy module is installed by cozy-scripts
    '.styl$': 'identity-obj-proxy',
    // Force cozy-client resolving to use harvest's version of cozy-client
    // Can be removed when cozy-client's version in the workspace is > 14.4.0.
    // Since otherwise harvest tries to mock unexisting methods from
    // cozy-client/models/account (getContractSyncStatusFromAccount for ex)
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index.js',
    '^cozy-ui(.*)': '<rootDir>/node_modules/cozy-ui/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-keys-lib))'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.js']
}
