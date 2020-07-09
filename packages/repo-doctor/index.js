const fetch = require('node-fetch')
const colorette = require('colorette')
const semverDiff = require('semver-diff')

const repositories = [{
  slug: 'cozy/cozy-banks'
}, {
  slug: 'cozy/cozy-store'
}, {
  slug: 'cozy/cozy-settings'
}, {
  slug: 'cozy/cozy-home'
}]

const dependencies = [
  'cozy-ui',
  'cozy-realtime',
  'cozy-harvest-lib',
  'cozy-flags'
]

const fromEntries = (entries) => {
  const res = {}
  for (let entry of entries) {
    res[entry[0]] = entry[1]
  }
  return res
}

const keyBy = (values, fn) => {
  return fromEntries(values.map(v => ([fn(v), v])))
}

const fetchDependencyInfo = async dependencyName => {
  const text = await fetch(`https://registry.npmjs.org/${dependencyName}`).then(resp => resp.text())
  const data = JSON.parse(text)
  const versions = Object.values(data.versions)
  return {
    name: data.name,
    lastVersion: versions[versions.length - 1].version
  }
}

const depEntryToObject = type => depEntry => ({
  name: depEntry[0],
  version: depEntry[1],
  type
})

const fetchRepositoryInfo = async repository => {
  const slug = repository.slug
  const packageJsonPath = repository.packageJsonPath || 'package.json'
  const packageJsonURL = `https://raw.githubusercontent.com/${slug}/master/${packageJsonPath}`
  const packageJsonText = await fetch(packageJsonURL).then(resp => resp.text())
  const packageJsonData = JSON.parse(packageJsonText)
  const allDependencies = [].concat(
    Object.entries(packageJsonData.dependencies || {}).map(depEntryToObject('dependencies'))
  ).concat(
    Object.entries(packageJsonData.devDependencies || {}).map(depEntryToObject('devDependencies'))
  ).concat(
    Object.entries(packageJsonData.peerDependencies || {}).map(depEntryToObject('peerDependencies'))
  )

  const filtered = allDependencies.filter(x => {
    return dependencies.includes(x.name)
  })

  return {
    dependencies: filtered,
    ...repository
  }
}

const colorsBySemverDiffType = {
  patch: colorette.blue,
  minor: colorette.yellow,
  major: colorette.red
}

const main = async () => {
  const dependencyInfos = await Promise.all(
    dependencies.map(fetchDependencyInfo)
  )
  
  const dependencyInfosByName = keyBy(
    dependencyInfos, depInfo => depInfo.name
  )

  const repositoryInfos = await Promise.all(
    repositories.map(fetchRepositoryInfo)
  )

  for (const repositoryInfo of repositoryInfos) {
    console.log(`Repository: ${repositoryInfo.slug}`)
    for (const dependency of repositoryInfo.dependencies) {
      const depInfo = dependencyInfosByName[dependency.name]
      if (!depInfo.lastVersion) {
        console.log(`No version for ${dependencyName}`)
        continue
      }
      if (!dependency.version) {
        console.log(`No version for ${dependencyName}`)
        continue
      }
      const diffType = semverDiff(dependency.version.replace('^',''), depInfo.lastVersion)
      const formatColor = colorsBySemverDiffType[diffType]
      console.log(' ',
        formatColor(`${dependency.name}: ${dependency.version}, last is ${depInfo.lastVersion}`
      ))
    }
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
