module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    // identity-obj-proxy module is installed by cozy-scripts
    styles: 'identity-obj-proxy',
    '^cozy-logger$': 'cozy-logger/dist/index.js',
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^cozy-client$': 'cozy-client/dist/index.js'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-keys-lib))'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js']
}
