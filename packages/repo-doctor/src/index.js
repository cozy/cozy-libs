const { ArgumentParser } = require('argparse')
const fs = require('fs')
const { depUpToDate, localesInRepo } = require('./checks')
const { fetchRepositoryInfo } = require('./fetch')
const { keyBy } = require('./toolbelt')
const ConsoleReporter = require('./reporters/console')

const checks = [
  depUpToDate,
  localesInRepo,
]

/**
 * Yields checkResults
 */
const runChecks = async function*(repositoryInfo, checks) {
  for (const check of checks) {
    for await (const checkResult of check(repositoryInfo)) {
      yield checkResult
    }
  }
}

const reporters = {
  console: ConsoleReporter
}

const main = async () => {
  const parser = new ArgumentParser()
  parser.addArgument('--repo')
  parser.addArgument('--dep')
  parser.addArgument('--reporter', {
    choices: Object.keys(reporters),
    defaultValue: 'console'
  })

  const args = parser.parseArgs()

  let repositories = JSON.parse(fs.readFileSync('./repositories.json'))
  if (args.repo) {
    repositories = repositories.filter(repo => repo.slug === args.repo)
  }

  let dependencies = JSON.parse(fs.readFileSync('./dependencies.json'))
  if (args.dep) {
    dependencies = dependencies.filter(dep => dep === args.dep)
  }

  const Reporter = reporters[args.reporter]
  const reporter = new Reporter(args)


  const repositoryInfos = await Promise.all(
    repositories.map(repo => fetchRepositoryInfo(repo, dependencies))
  )

  for (const repositoryInfo of repositoryInfos) {
    // eslint-disable-next-line no-console
    console.log(`Repository: ${repositoryInfo.slug}`)
    for await (const message of runChecks(repositoryInfo, checks)) {
      reporter.write(message)
    }
  }
  reporter.flush()
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
