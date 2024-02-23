const eslintConfigCozyApp = require('./packages/eslint-config-cozy-app')

module.exports = [
  ...eslintConfigCozyApp,

  // Using different rules for nested directories
  // According to ESLint maintainers, any nested override should be done in the root config
  // https://github.com/eslint/eslint/discussions/16472#discussioncomment-4110511
  {
    files: [
      '**/cozy-realtime/**',
      '**/cozy-procedures/**',
      '**/cozy-app-publish/**'
    ],
    rules: {
      'no-console': 'off'
    }
  }
]
