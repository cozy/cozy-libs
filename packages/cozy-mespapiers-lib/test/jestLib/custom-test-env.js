const { TestEnvironment } = require('jest-environment-jsdom')

module.exports = class CustomTestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super({ projectConfig: config }, context)
  }

  async setup() {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
    }
  }
}
