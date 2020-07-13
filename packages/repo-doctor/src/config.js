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

module.exports = {
  schema
}
