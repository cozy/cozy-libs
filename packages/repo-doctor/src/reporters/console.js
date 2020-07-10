const colorette = require('colorette')

const colorsBySeverity = {
  success: colorette.green,
  info: colorette.blue,
  warn: colorette.yellow,
  error: colorette.red
}

class ConsoleReporter {
  write(message) {
    if (!colorsBySeverity[message.severity]) {
      // eslint-disable-next-line no-console
      console.warn('Unknown severity', message.severity, message)
      return
    }

    const formatColor = colorsBySeverity[message.severity]
    // eslint-disable-next-line no-console
    console.log(`  ${message.type}: ${formatColor(message.message)}`)
  }

  flush() {}
}

module.exports = ConsoleReporter
