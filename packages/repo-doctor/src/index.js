#!/usr/bin/env node

const { ArgumentParser } = require('argparse')
const fs = require('fs')
const path = require('path')
const get = require('lodash/get')
const merge = require('lodash/merge')
const validate = require('schema-utils')
const levn = require('levn')

const { setupRules, runRules } = require('./rules')
const { fetchRepositoryInfo } = require('./fetch')
const { ConsoleReporter, MattermostReporter } = require('./reporters')
const { schema: configSchema, mergeConfigFromArgs } = require('./config')

const reporters = {
  console: ConsoleReporter,
  mattermost: MattermostReporter
}

const main = async () => {
  const parser = new ArgumentParser()
  parser.addArgument('--repo', {
    help: 'Run rules only on a repository'
  })
  parser.addArgument('--dep', {
    help: 'Run rules only on selected dependencies'
  })
  parser.addArgument('--reporter', {
    choices: Object.keys(reporters),
    defaultValue: 'console',
    help: 'Where to send the output (by default: console)'
  })
  parser.addArgument('--configFile', {
    defaultValue: path.join(process.cwd(), './repo-doctor.json'),
    help: 'Path to config'
  })
  parser.addArgument('--config', {
    help:
      'Config options ex: --config "dep-up-to-date: { dependencies: [\'cozy-ui\'] }"'
  })
  parser.addArgument('--rule', {
    help: 'Run only selected rule'
  })

  const args = parser.parseArgs()
  const config = JSON.parse(fs.readFileSync(args.configFile))
  const argConfig = args.config ? levn.parse('Object', args.config) : null

  // Merge config from args to JSON config
  if (argConfig) {
    mergeConfigFromArgs(config, argConfig)
  }

  validate(configSchema, {}, config)

  let repositories = config.repositories
  if (args.repo) {
    repositories = repositories.filter(repo => repo.slug === args.repo)
  }

  let rules = setupRules(config)
  if (args.rule) {
    rules = rules.filter(r => r.constructor.name === args.rule)
  }

  const Reporter = reporters[args.reporter]
  const reporterConfig = get(config, `reporters.${args.reporter}`)
  const reporter = new Reporter(reporterConfig)

  const repositoryInfos = await Promise.all(
    repositories.map(repo => fetchRepositoryInfo(repo))
  )

  for (const repositoryInfo of repositoryInfos) {
    // eslint-disable-next-line no-console
    reporter.write({ message: `Repository: ${repositoryInfo.slug}` })
    for await (const message of runRules(repositoryInfo, rules)) {
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
