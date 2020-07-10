const { ArgumentParser } = require('argparse')
const fs = require('fs')
const { depUpToDate, noForbiddenDep, localesInRepo } = require('./checks')
const { fetchRepositoryInfo } = require('./fetch')
const ConsoleReporter = require('./reporters/console')

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

const FORBIDDEN_DEPS = [
  {
    name: 'babel-preset-cozy-app',
    reason: 'Used through cozy-scripts'
  },
  {
    name: 'eslint-loader',
    reason: 'Used through cozy-scripts'
  }
]

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

  const checks = [
    depUpToDate({ dependencies }),
    localesInRepo,
    noForbiddenDep({
      dependencies: FORBIDDEN_DEPS
    })
  ]

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
