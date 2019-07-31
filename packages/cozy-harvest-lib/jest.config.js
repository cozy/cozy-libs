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
    '^cozy-logger$': 'cozy-logger/dist/index.js'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js']
}
