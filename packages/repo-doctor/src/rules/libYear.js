const { fetchRepositoryDirectoryContent } = require('../fetch')

class LibYear {
  async *run(repositoryInfo) {
    // 1. Fetch package.json / yarn.lock
    const localeDirContent = await fetchRepositoryDirectoryContent(
      repositoryInfo.slug)

    // 2. Run 'yarn libyear'


    // 3. Extract values from result
    //   drift: package is 108.09 libyears behind.
    //   pulse: dependencies are 122.72 libyears behind.
    //   releases: dependencies are 983 releases behind.
    //   major: dependencies are 82 releases behind.
    //   minor: dependencies are 324 releases behind.
    //   patch: dependencies are 577 releases behind.

    // 4 Format and return values

  }
}

module.exports = { LibYear }
