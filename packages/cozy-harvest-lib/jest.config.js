module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    // identity-obj-proxy module is installed by cozy-scripts
    styles: 'identity-obj-proxy',
    '\\.(png|gif|jpe?g|svg)$': '<rootDir>/test/__mocks__/file.js'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)']
}
