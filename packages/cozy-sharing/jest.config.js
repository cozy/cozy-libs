module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.stories.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/__tests__/'
  ],
  roots: ['<rootDir>/src'],
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '.(png|gif|jpe?g)$': '<rootDir>/jestHelpers/mocks/fileMock.js',
    '.svg$': '<rootDir>/jestHelpers/mocks/iconMock.js',
    // identity-obj-proxy module is installed by cozy-scripts
    '.styl$': 'identity-obj-proxy',
    '^cozy-logger$': 'cozy-logger/dist/index.js',
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index.js',
    '^cozy-client/dist/types$':
      '<rootDir>/node_modules/cozy-client/dist/types.js'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(cozy-ui|cozy-harvest-lib))'
  ],
  setupFilesAfterEnv: ['<rootDir>/jestHelpers/setup.js']
}
