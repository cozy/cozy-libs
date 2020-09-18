const { fetchRepositoryFileContent } = require('../fetch')

class TravisIsOK {
  async *run(repositoryInfo) {
    const travisContent = await fetchRepositoryFileContent(
      repositoryInfo.slug,
      '.travis.yml'
    ).then(x => x.text())

    if (travisContent.includes('deadsnakes')) {
      yield {
        severity: 'warn',
        message:
          'Python deadsnakes is installed during CI, this should be unnecessary',
        type: 'travis-lint'
      }
    }

    if (travisContent.includes('fast_finish')) {
      yield {
        severity: 'warn',
        message:
          'fast_finish parameter most likely is not needed if you do not use the matrix feature from travis',
        type: 'travis-lint'
      }
    }
  }
}

TravisIsOK.configSchema = {
  name: 'DepUpToDate',
  type: 'object',
  additionalProperties: false
}

module.exports = { TravisIsOK }
