module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/*.stories.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: ['node_modules', 'dist', '__tests__'],
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
    '^cozy-client$': 'cozy-client/dist/index.js'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)'],
  setupFilesAfterEnv: ['<rootDir>/jestHelpers/setup.js']
}
