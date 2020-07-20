class ConfigError extends Error {
  constructor(...args) {
    super(...args)
    this.name = 'ConfigError'
  }
}

module.exports = { ConfigError }
