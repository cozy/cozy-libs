const { ArgumentParser } = require('argparse')
const fs = require('fs')
const path = require('path')

const { setupChecks, runChecks } = require('./checks')
const { fetchRepositoryInfo } = require('./fetch')
const { ConsoleReporter, MattermostReporter } = require('./reporters')

const reporters = {
  console: ConsoleReporter,
  mattermost: MattermostReporter
}

const main = async () => {
  const parser = new ArgumentParser()
  parser.addArgument('--repo')
  parser.addArgument('--dep')
  parser.addArgument('--reporter', {
    choices: Object.keys(reporters),
    defaultValue: 'console'
  })
  parser.addArgument('--config', {
    defaultValue: path.join(process.cwd(), './repo-doctor.json')
  })

  const args = parser.parseArgs()
  const config = JSON.parse(fs.readFileSync(args.config))

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
