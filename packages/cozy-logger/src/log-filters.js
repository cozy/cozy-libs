const levels = {
  secret: 0,
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  ok: 50,
  critical: 50
}

const Secret = require('./Secret')

const filterSecrets = function(level, type, message) {
  if (type !== 'secret' && message instanceof Secret) {
    throw new Error('You should log a secret with log.secret')
  }
}

const filterLevel = function(level, type) {
  return levels[type] >= levels[level]
}

module.exports = {
  filterSecrets,
  filterLevel
}
