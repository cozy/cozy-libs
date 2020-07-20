const validate = require('schema-utils')

const { ConfigError } = require('./errors')

const schema = {
  name: 'global config',
  type: 'object',
  properties: {
    repositories: {
      type: 'array'
    },
    rules: {
      type: 'array'
    },
    reporters: {
      type: 'object'
    }
  },
  additionalProperties: false
}

const mergeConfigFromArgs = (config, argConfig) => {
  if (argConfig) {
    for (let i = 0; i < config.rules.length; i++) {
      const r = config.rules[0]
      if (r.length) {
        const ruleName = r[0]
        const ruleConfig = r[1]
        Object.assign(ruleConfig, argConfig[ruleName])
      } else {
        const ruleName = r
        const ruleConfig = argConfig[ruleName]
        config.rules.splice(i, 1, [ruleName, ruleConfig])
      }
    }
  }
}

const validateConfig = (configSchema, config) => {
  try {
    validate(configSchema, config)
  } catch (e) {
    throw new ConfigError(e.message)
  }
}

module.exports = {
  schema,
  mergeConfigFromArgs,
  validateConfig
}
