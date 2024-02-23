const memoize = require('lodash/memoize')
const fetch = require('node-fetch')

const depEntryToObject = type => depEntry => ({
  name: depEntry[0],
  version: depEntry[1],
  type
})

const fetchRepositoryInfo = async repository => {
  const slug = repository.slug
  const packageJsonPath = repository.packageJsonPath || 'package.json'
  const packageJsonURL = `https://raw.githubusercontent.com/${slug}/master/${packageJsonPath}`
  const packageJsonData = await fetch(packageJsonURL).then(resp => resp.json())
  const allDependencies = []
    .concat(
      Object.entries(packageJsonData.dependencies || {}).map(
        depEntryToObject('dependencies')
      )
    )
    .concat(
      Object.entries(packageJsonData.devDependencies || {}).map(
        depEntryToObject('devDependencies')
      )
    )
    .concat(
      Object.entries(packageJsonData.peerDependencies || {}).map(
        depEntryToObject('peerDependencies')
      )
    )

  return {
    dependencies: allDependencies,
    ...repository
  }
}

const fetchDependencyInfo = memoize(
  async dependencyName => {
    const text = await fetch(
      `https://registry.npmjs.org/${dependencyName}`
    ).then(resp => resp.text())
    const data = JSON.parse(text)
    const versions = Object.values(data.versions)
    return {
      name: data.name,
      lastVersion: versions[versions.length - 1].version
    }
  },
  dependencyName => dependencyName
)

const fetchRepositoryDirectoryContent = memoize(
  async (repoSlug, pathName) => {
    return fetch(
      `https://api.github.com/repos/${repoSlug}/contents/${pathName}`
    ).then(resp => resp.json())
  },
  (repoSlug, pathName) => `${repoSlug} / ${pathName}`
)

const fetchRepositoryFileContent = memoize(
  async (repoSlug, pathName) => {
    return fetch(
      `https://raw.githubusercontent.com/${repoSlug}/master/${pathName}`
    )
  },
  (repoSlug, pathName) => `${repoSlug} / ${pathName}`
)

module.exports = {
  fetchRepositoryInfo,
  fetchDependencyInfo,
  fetchRepositoryDirectoryContent,
  fetchRepositoryFileContent
}
