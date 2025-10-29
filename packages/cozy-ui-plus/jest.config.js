module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./test/jestsetup.js', 'jest-canvas-mock'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/fileMock.js',
    '\\.styl$': 'identity-obj-proxy',
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index',
    '^cozy-client/dist/types$':
      '<rootDir>/node_modules/cozy-client/dist/types.js',
    '^cozy-ui(.*)': '<rootDir>/node_modules/cozy-ui/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui))'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  }
}
