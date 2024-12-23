module.exports = {
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl', 'ts', 'tsx'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.styl$': 'identity-obj-proxy',
    'react-pdf/dist/esm/entry.webpack': 'react-pdf',
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index',
    '^cozy-ui(.*)': '<rootDir>/node_modules/cozy-ui/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-harvest-lib))'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  }
}
