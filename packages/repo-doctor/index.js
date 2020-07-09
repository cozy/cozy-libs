const fetch = require('node-fetch')
const colorette = require('colorette')
const fs = require('fs')
const semverDiff = require('semver-diff')
const {
  checkDependencies
} = require('./checks')
const {
  fetchDependencyInfo,
  fetchRepositoryInfo
} = require('./fetch')
const {
  keyBy
} = require('./toolbelt')

const colorsBySemverDiffType = {
  patch: colorette.blue,
  minor: colorette.yellow,
  major: colorette.red
}

const checks = [checkDependencies]

const main = async () => {
  const repositories = JSON.parse(fs.readFileSync(path.join(__dirname, '../repositories.json')))
  const dependencies = JSON.parse(fs.readFileSync(path.join(__dirname, '../dependencies.json')))

  const dependencyInfos = await Promise.all(
    dependencies.map(fetchDependencyInfo)
  )

  const dependencyInfosByName = keyBy(dependencyInfos, depInfo => depInfo.name)

  const repositoryInfos = await Promise.all(
    repositories.map(repo => fetchRepositoryInfo(repo, dependencies))
  )

  for (const repositoryInfo of repositoryInfos) {
    console.log(`Repository: ${repositoryInfo.slug}`)
    for (const check of checks) {
      check(repositoryInfo, { dependencyInfos: dependencyInfosByName })
    }
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
