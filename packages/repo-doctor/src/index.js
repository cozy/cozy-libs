#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const { ArgumentParser } = require('argparse')
const levn = require('levn')
const get = require('lodash/get')

const {
  schema: configSchema,
  mergeConfigFromArgs,
  validateConfig
} = require('./config')
const { autoDetectRepository } = require('./detect')
const { ConfigError } = require('./errors')
const { fetchRepositoryInfo } = require('./fetch')
const { ConsoleReporter, MattermostReporter } = require('./reporters')
const { setupRules, runRules } = require('./rules')

const reporters = {
  console: ConsoleReporter,
  mattermost: MattermostReporter
}

const getDefaultConfigPath = () => {
  const configDir =
    process.env.XDG_CONFIG_HOME || path.join(process.env.HOME, '.config')
  return path.join(configDir, './repo-doctor.json')
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
    defaultValue: getDefaultConfigPath(),
    help: 'Path to config'
  })
  parser.addArgument('--config', {
    help: 'Config options ex: --config "dep-up-to-date: { dependencies: [\'cozy-ui\'] }"'
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

  try {
    validateConfig(configSchema, config)
  } catch (e) {
    if (e instanceof ConfigError) {
      // eslint-disable-next-line no-console
      console.error(e.message)
      process.exit(1)
    } else {
      throw e
    }
  }

  let repositories = config.repositories

  const filterRepo = args.repo || (await autoDetectRepository())
  if (filterRepo) {
    if (!args.repo) {
      // eslint-disable-next-line no-console
      console.info('Detected repository as', filterRepo)
    }
    repositories = repositories.filter(repo => repo.slug === filterRepo)
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
