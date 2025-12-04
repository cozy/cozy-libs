module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./test/jestsetup.js', 'jest-canvas-mock'],
  moduleDirectories: ['src', 'node_modules'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  }
}
