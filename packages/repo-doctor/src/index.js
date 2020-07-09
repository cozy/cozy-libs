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

const colorsBySeverity = {
  info: colorette.blue,
  warn: colorette.yellow,
  error: colorette.red
}

const checks = [checkDependencies]

const main = async () => {
  const repositories = JSON.parse(fs.readFileSync('./repositories.json'))
  const dependencies = JSON.parse(fs.readFileSync('./dependencies.json'))

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
      for (const message of check(repositoryInfo, { dependencyInfos: dependencyInfosByName })) {
        const formatColor = colorsBySeverity[message.severity]
        console.log(`  ${message.type}: ${formatColor(message.message)}`)
      }

    }
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
