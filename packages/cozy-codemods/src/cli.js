#!/usr/bin/env node

/* eslint-disable no-console */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const { build, completionHandler } = require('@cozy/cli-tree')

const ignored = new Set(['__testfixtures__', '__tests__'])

const getTransformNames = () => {
  const transformsDir = path.join(__dirname, 'transforms')
  const transforms = fs.readdirSync(transformsDir).filter(x => !ignored.has(x))
  const transformNames = transforms.map(x => x.replace(/\.js$/, ''))
  return transformNames
}

const listHandler = args => {
  const transformNames = getTransformNames()
  for (const name of transformNames) {
    const mod = require(`./transforms/${name}`)
    if (args.description && mod.description) {
      console.log(`${name}: ${mod.description}`)
    } else {
      console.log(name)
    }
  }
}

const showExampleHandler = args => {
  const { transformName } = args

  const inputPath = path.join(
    __dirname,
    'transforms/__testfixtures__',
    `${transformName}.input.js`
  )
  const outputPath = path.join(
    __dirname,
    'transforms/__testfixtures__',
    `${transformName}.output.js`
  )

  if (!fs.existsSync(inputPath)) {
    console.warn(
      `There is no example for ${transformName} unfortunately, you can open an issue about that or write the example yourself :)`
    )
    return
  }

  spawnSync(
    'git',
    [
      'diff',
      '--no-index', // when installed as a package, we are not in a repo

      inputPath,
      outputPath
    ],
    {
      stdio: 'inherit'
    }
  )
}

const runHandler = args => {
  const transformFile = path.join(
    __dirname,
    'transforms',
    `${args.transformName}`
  )
  const defaultJscodeshiftArgs = args.noDefaultJscodeshiftArgs
    ? []
    : [
        '-t',
        `${transformFile}.js`,
        '--parser',
        'babel',
        '--extensions',
        'js,jsx'
      ]

  spawnSync(
    'yarn',
    ['run', 'jscodeshift', ...defaultJscodeshiftArgs, ...args.rest],
    {
      stdio: 'inherit'
    }
  )

  console.log('Done ! You might want to run a linter now.')
}

const transformNameArg = {
  argument: 'transformName',
  help: 'Name of transform (use list to show all the transforms)',
  choices: getTransformNames()
}

const main = async () => {
  const commands = {
    list: {
      description: 'List codemods',
      handler: listHandler,
      arguments: [
        {
          argument: '--description',
          action: 'storeTrue'
        }
      ]
    },
    run: {
      description: 'Runs a codemod from @cozy/codemods',
      arguments: [
        transformNameArg,
        {
          argument: '--no-default-jscodeshift-args',
          action: 'storeTrue',
          dest: 'noDefaultJscodeshiftArgs'
        },
        {
          argument: 'rest',
          nargs: '*',
          help: 'Pass jscodeshift args after --: cozy-codemods run apply-flag -- --ignore-pattern=src/ignored src'
        }
      ],
      handler: runHandler
    },
    showExample: {
      description: 'Shows an example of what the transform will do',
      arguments: [transformNameArg],
      handler: showExampleHandler
    }
  }

  await completionHandler(commands)
  const [parser] = build(commands)
  const args = parser.parseArgs()
  args.handler(args)
}

if (require.main === module) {
  main().catch(e => {
    console.error(e)
    process.exit(1)
  })
}
