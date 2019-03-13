#!/usr/bin/env node

'use strict'

const commander = require('commander')
const colorize = require('./utils/colorize')
const scripts = require('./index')
const capitalize = require('lodash/capitalize')

const pkg = require('./package.json')

const MODES = {
  TRAVIS: 'travis',
  MANUAL: 'manual'
}

const program = new commander.Command(pkg.name)
  .version(pkg.version)
  .usage(`[options]`)
  .option(
    '--token <editor-token>',
    'Registry token matching the provided editor (required)'
  )
  .option(
    '--space <space-name>',
    'Registry space name to publish the application to (default __default__)'
  )
  .option(
    '--build-dir <relative-path>',
    'Path of the build directory relative to the current directory (default ./build)'
  )
  .option('--build-url <url>', 'URL of the application archive')
  .option(
    '--build-commit <commit-hash>',
    'Hash of the build commit matching the build archive to publish'
  )
  .option(
    '--manual-version <version>',
    'Specify a version manually (must not be already published in the registry)'
  )
  .option(
    '--prepublish <script-path>',
    'Hook to process parameters just before publishing, typically to upload archive on custom host'
  )
  .option(
    '--postpublish <script-path>',
    'Hook to process parameters just after publishing, typically to deploy app'
  )
  .option(
    '--tag-prefix <tag-prefix>',
    'When publishing from a monorepo, only consider tags with tagPrefix, ex: cozy-banks/1.0.1.'
  )
  .option('--yes', 'Force confirmation when publishing manually')
  .option(
    '--registry-url <url>',
    'Registry URL to publish to a different one from the default URL'
  )
  .option('--verbose', 'print additional logs')
  .on('--help', () => {
    console.log()
    console.log(`\t--- ${colorize.bold('USAGE INFORMATIONS')} ---`)
    console.log()
    console.log(
      `\tThis tool allows you to publish a Cozy application to the Cozy registry.`
    )
  })
  .parse(process.argv)

const handleError = error => {
  console.log(colorize.red(`Publishing failed: ${error.message}`))
  process.exit(1)
}

try {
  publishApp(program).catch(handleError)
} catch (error) {
  handleError(error)
}

function _getPublishMode() {
  if (process.env.TRAVIS === 'true') {
    return MODES.TRAVIS
  } else {
    // default mode
    return MODES.MANUAL
  }
}

async function publishApp(cliOptions) {
  const publishMode = _getPublishMode()
  const publishFn = scripts[publishMode]

  console.log()
  console.log(
    `${colorize.bold(capitalize(publishMode))} ${colorize.blue('publish mode')}`
  )
  console.log()
  return publishFn({
    appBuildUrl: cliOptions.buildUrl,
    buildCommit: cliOptions.buildCommit,
    buildDir: cliOptions.buildDir,
    buildUrl: cliOptions.buildUrl,
    manualVersion: cliOptions.manualVersion,
    postpublishHook: cliOptions.postpublish,
    prepublishHook: cliOptions.prepublish,
    registryToken: cliOptions.token,
    registryUrl: cliOptions.registryUrl,
    spaceName: cliOptions.space,
    tagPrefix: cliOptions.tagPrefix,
    verbose: cliOptions.verbose,
    yes: cliOptions.yes
  })
}
