const util = require('util')
const chalk = require('chalk')

if (util && util.inspect && util.inspect.defaultOptions) {
  util.inspect.defaultOptions.maxArrayLength = null
  util.inspect.defaultOptions.depth = 2
  util.inspect.defaultOptions.colors = true
}

const type2color = {
  debug: 'cyan',
  warn: 'yellow',
  info: 'blue',
  error: 'red',
  ok: 'green',
  secret: 'red',
  critical: 'red'
}

function devFormat(type, message, label, namespace) {
  let formatmessage = message

  if (typeof formatmessage !== 'string') {
    formatmessage = util.inspect(formatmessage)
  }

  let formatlabel = label ? ` : "${label}" ` : ''
  let formatnamespace = namespace ? chalk.magenta(`${namespace}: `) : ''

  let color = type2color[type]
  let formattype = color ? chalk[color](type) : type

  return `${formatnamespace}${formattype}${formatlabel} : ${formatmessage}`
}

module.exports = devFormat
