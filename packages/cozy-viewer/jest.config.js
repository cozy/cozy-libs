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
    '^cozy-client/src/(.*)$': '<rootDir>/node_modules/cozy-client/dist/$1',
    '^cozy-client$': '<rootDir>/node_modules/cozy-client/dist/index',
    '^cozy-client/dist/(.*)$': '<rootDir>/node_modules/cozy-client/dist/$1',
    '^cozy-ui$': '<rootDir>/node_modules/cozy-ui/$1',
    '^cozy-flags$': '<rootDir>/test/__mocks__/cozyFlagsMock.js',
    '^cozy-intent$': '<rootDir>/test/__mocks__/cozy-intent.js',
    '^cozy-sharing$': '<rootDir>/test/__mocks__/cozy-sharing.js',
    '^cozy-harvest-lib/dist/components/KonnectorBlock$':
      '<rootDir>/test/__mocks__/cozy-harvest-lib.js'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-harvest-lib))'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  }
}
