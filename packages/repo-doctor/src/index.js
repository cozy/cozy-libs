const { ArgumentParser } = require('argparse')
const fs = require('fs')
const checkFns = require('./checks')
const { fetchRepositoryInfo } = require('./fetch')
const { ConsoleReporter, MattermostReporter } = require('./reporters')
const config = require('./config.json')
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
  console: ConsoleReporter,
  mattermost: MattermostReporter
}

const setupChecks = (config, args) => {
  const checks = config.rules.map(
    (rule => {
      let ruleName
      let options
      if (Array.isArray(rule)) {
        ruleName = rule[0]
        options = rule[1]
      } else {
        ruleName = rule
        options = {}
      }
      const checkFn = checkFns[ruleName]
      return checkFn(options, args)
    })
  )
  return checks
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

  let repositories = config.repositories
  if (args.repo) {
    repositories = repositories.filter(repo => repo.slug === args.repo)
  }

  const checks = setupChecks(config, args)
  const Reporter = reporters[args.reporter]
  const reporter = new Reporter(args)

  const repositoryInfos = await Promise.all(
    repositories.map(repo => fetchRepositoryInfo(repo))
  )

  for (const repositoryInfo of repositoryInfos) {
    // eslint-disable-next-line no-console
    reporter.write({ message: `Repository: ${repositoryInfo.slug}` })
    for await (const message of runChecks(repositoryInfo, checks)) {
      reporter.write(message)
    }
  }
  await reporter.flush()
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
