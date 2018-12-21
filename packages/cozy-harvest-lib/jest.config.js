module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    // identity-obj-proxy module is installed by cozy-scripts
    styles: 'identity-obj-proxy'
  },
  transformIgnorePatterns: ['node_modules/(?!cozy-ui)']
}
