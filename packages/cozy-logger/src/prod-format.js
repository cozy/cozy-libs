const stringify = require('json-stringify-safe')

const LOG_LENGTH_LIMIT = 64 * 1024 - 1

function prodFormat(type, message, label, namespace) {
  const log = { time: new Date(), type, label, namespace }

  if (typeof message === 'object') {
    if (message && message.no_retry) {
      log.no_retry = message.no_retry
    }
    if (message && message.message) {
      log.message = message.message
    }
  } else {
    log.message = message
  }

  // properly display error messages
  if (log.message && log.message.stack) {
    log.message = log.message.stack
  }

  // cut the string to avoid a fail in the stack
  let result = log
  try {
    result = stringify(log).substr(0, LOG_LENGTH_LIMIT)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message, 'cozy-logger: Failed to convert message to JSON')
  }
  return result
}

module.exports = prodFormat
