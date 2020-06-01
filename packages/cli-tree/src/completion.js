/* eslint no-console: off */
const tabtab = require('tabtab')
const get = require('lodash/get')
const toPairs = require('lodash/toPairs')
const _ = require('lodash')

module.exports = {
  getCompletionSetupCommands,
  completionHandler: async (commands = {}) => {
    const env = tabtab.parseEnv(process.env)

    if (!env.complete) {
      return false
    }

    const command = findCommand(
      { _main: commands },
      '_main ' +
        env.line
          .split(' ')
          .slice(1)
          .join(' ')
    )
    if (!command) process.exit(1)

    const completion = getCommandCompletion(command)
    await tabtab.log(completion)
    process.exit()
  },
  findCommand,
  getCommandCompletion
}

function getCommandCompletion(command) {
  let completion = []
  if (command.arguments) {
    completion = _(command.arguments)
      .flatMap(a => a.argument)
      .filter(isOptionalArgument)
      .value()
  } else {
    completion = getSubCommands(command)
  }
  return completion
}
function getSubCommands(command) {
  return toPairs(command)
    .filter(([, val]) => typeof val === 'object')
    .map(([key]) => key)
}

function isOptionalArgument(arg) {
  return arg.substr(0, 1) === '-'
}

function findCommand(commands, line) {
  const words = line
    .trim()
    .split(' ')
    .filter(w => !isOptionalArgument(w))
  let command = null
  while (words.length && !command) {
    const path = words.join('.')
    command = get(commands, path)
    if (!command) words.pop()
  }
  return command
}

function getCompletionSetupCommands(parser) {
  const progName = parser.prog
  return {
    completion: {
      install: {
        description: 'Installs completion',
        handler: () => tabtab.install({ name: progName, completer: progName })
      },
      uninstall: {
        description: 'Uninstalls completion',
        handler: () => tabtab.uninstall({ name: progName })
      }
    }
  }
}
