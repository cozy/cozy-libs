module.exports = {
  browser: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  roots: ['src'],
  resolver: '<rootDir>/test/jestLib/resolver.js',
  testEnvironment: '<rootDir>/test/jestLib/custom-test-env.js',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index.js'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)'],
  setupFilesAfterEnv: ['<rootDir>/test/jestLib/setup.js']
}
