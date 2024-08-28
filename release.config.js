module.exports = {
  branches: ['feat/try-npm-login'],
  plugins: [
    '@semantic-release/commit-analyzer',
    ['semantic-release-lerna', { generateNotes: true }],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'lerna.json',
          'package.json',
          'yarn.lock',
          'packages/*/package.json',
          'packages/*/yarn.lock'
        ]
      }
    ]
  ]
}
