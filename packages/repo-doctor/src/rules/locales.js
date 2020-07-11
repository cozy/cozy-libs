const fetch = require('node-fetch')

const fetchRepositoryDirectoryContent = async (repoSlug, pathName) => {
  return await fetch(
    `https://api.github.com/repos/${repoSlug}/contents/${pathName}`
  ).then(resp => resp.json())
}

const localesInRepo = () =>
  async function*(repositoryInfo) {
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

module.exports = { localesInRepo }
