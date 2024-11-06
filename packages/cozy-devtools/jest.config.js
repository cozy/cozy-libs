module.exports = {
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '^cozy-client$': 'cozy-client/dist/index'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui)'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  },
  globals: {
    __ALLOW_HTTP__: false,
    cozy: {}
  },
  setupFilesAfterEnv: ['jest-canvas-mock']
}
