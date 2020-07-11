const colorette = require('colorette')

const colorsBySeverity = {
  success: colorette.green,
  info: colorette.blue,
  warn: colorette.yellow,
  error: colorette.red
}

class ConsoleReporter {
  write(message) {
    const formatColor = colorsBySeverity[message.severity] || (x => x)
    // eslint-disable-next-line no-console
    console.log(
      `${message.type ? `  ${message.type}: ` : ''}${formatColor(
        message.message
      )}`
    )
  }

  flush() {}
}

module.exports = ConsoleReporter
