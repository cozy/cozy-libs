'use strict'

const { declare } = require('@babel/helper-plugin-utils')
const browserslist = require('browserslist-config-cozy')
const { validate, isOfType } = require('./validate')
const mapValues = require('lodash/mapValues')

const browserEnv = {
  targets: browserslist,
  useBuiltIns: false
}

const nodeEnv = {
  targets: {
    node: 8
  },
  // don't transform polyfills
  useBuiltIns: false
}

const optionConfigs = {
  node: {
    default: false,
    validator: isOfType('boolean')
  },
  react: {
    default: true,
    validator: isOfType('boolean')
  },
  transformRegenerator: {
    default: true,
    validator: isOfType('boolean')
  }
}

const validators = mapValues(optionConfigs, x => x.validator)
const defaultOptions = mapValues(optionConfigs, x => x.default)

module.exports = declare((api, options) => {
  const presetOptions = {
    ...defaultOptions,
    ...options
  }

  try {
    validate(presetOptions, validators)
  } catch (e) {
    e.message = `babel-preset-cozy-app : Config validation error : ${e.message}`
    throw e
  }

  const { node, react, transformRegenerator } = presetOptions

  const config = {}

  // Latest ECMAScript features on previous browsers versions
  let env = [require.resolve('@babel/preset-env')]
  if (node) {
    env.push(nodeEnv)
  } else {
    env.push(browserEnv)
  }

  let presets = [env]
  // if (P)React app
  if (!node && react) presets.push(require.resolve('@babel/preset-react'))
  config.presets = presets

  const plugins = [
    // transform class attributes and methods with auto-binding
    // to the class instance and no constructor needed
    require.resolve('@babel/plugin-proposal-class-properties'),
    // Transform rest properties for object destructuring assignment
    // and spread properties for object literals
    // useBuiltIns to directly use Object.assign instead of using Babel extends
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      {
        useBuiltIns: false
      }
    ]
  ]
  if (!node && transformRegenerator) {
    plugins.push(
      // Polyfills generator functions (for async/await usage)
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          helpers: false,
          regenerator: true
        }
      ]
    )
  }
  config.plugins = plugins
  return config
})
