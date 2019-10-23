/**
 * Since we are using a custom babel config
 * we need to create a Transformer to tell
 * jest to use it
 */

const config = require('./babel.config')
const { createTransformer } = require('babel-jest')
module.exports = createTransformer(config)
