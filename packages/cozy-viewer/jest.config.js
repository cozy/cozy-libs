module.exports = {
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl', 'ts', 'tsx'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.styl$': 'identity-obj-proxy',
    'react-pdf/dist/esm/entry.webpack': 'react-pdf',
    '^cozy-client$': 'cozy-client/dist/index'
  },
  transformIgnorePatterns: ['node_modules/(?!(cozy-ui|cozy-harvest-lib))'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  },
  globals: {
    __ALLOW_HTTP__: false,
    cozy: {}
  },
  setupFilesAfterEnv: ['<rootDir>/test/jestLib/setup.js', 'jest-canvas-mock'],
  snapshotSerializers: ['enzyme-to-json/serializer']
}
