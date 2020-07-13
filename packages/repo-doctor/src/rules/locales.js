const { fetchRepositoryDirectoryContent } = require('../fetch')

class LocalesInRepo {
  async *run(repositoryInfo) {
    const localeDirContent = await fetchRepositoryDirectoryContent(
      repositoryInfo.slug,
      'src/locales'
    )

    if (localeDirContent.length > 1) {
      yield {
        severity: 'success',
        message: 'Locales are stored in the repository',
        type: 'locales-in-repo'
      }
    } else {
      yield {
        severity: 'warn',
        message: 'Locales are not stored in the repository',
        type: 'locales-in-repo'
      }
    }
  }
}

module.exports = { LocalesInRepo }
