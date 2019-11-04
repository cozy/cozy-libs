const { getMessage } = require('./mattermost')

describe('get message', () => {
  const commonInfo = {
    appSlug: 'banks',
    appVersion: '1.6.1',
    spaceName: 'banks',
    appType: 'webapp'
  }

  describe('with travis vars', () => {
    const travisVars = {
      TRAVIS_COMMIT_MESSAGE:
        'Beautiful commit title\n\nAnd a beautiful explanation',
      TRAVIS_JOB_WEB_URL: 'https://travis.com/cozy/cozy-banks/jobs/jobId1234',
      TRAVIS_REPO_SLUG: 'cozy/cozy-banks',
      TRAVIS_COMMIT: 'sha1deadbeef'
    }

    beforeEach(() => {
      Object.assign(process.env, travisVars)
    })

    afterEach(() => {
      Object.keys(travisVars).forEach(k => {
        delete process.env[k]
      })
    })

    it('should work', () => {
      expect(getMessage(commonInfo))
        .toBe(`Application __banks__ version \`1.6.1\` has been published on space __banks__.

- [Last commit: Beautiful commit title](https://github.com/cozy/cozy-banks/commits/sha1deadbeef)
- [Job](https://travis.com/cozy/cozy-banks/jobs/jobId1234)`)
    })
  })

  it('should work', () => {
    expect(getMessage(commonInfo)).toBe(
      `Application __banks__ version \`1.6.1\` has been published on space __banks__.`
    )
  })
})
