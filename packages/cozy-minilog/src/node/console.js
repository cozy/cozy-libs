/* eslint-disable no-console */
var Transform = require('../common/transform.js')

function ConsoleBackend() {}

Transform.mixin(ConsoleBackend)

ConsoleBackend.prototype.write = function () {
  console.log.apply(console, arguments)
}

var e = new ConsoleBackend()

// eslint-disable-next-line no-unused-vars
var levelMap = require('./formatters/util.js').levelMap

e.filterEnv = function () {
  console.error(
    'Minilog.backends.console.filterEnv is deprecated in Minilog v2.'
  )
  // return the instance of Minilog
  return require('../common/minilog.js')
}

e.formatters = [
  'formatClean',
  'formatColor',
  'formatNpm',
  'formatLearnboost',
  'formatMinilog',
  'formatWithStack',
  'formatTime'
]

e.formatClean = new (require('./formatters/clean.js'))()
e.formatColor = new (require('./formatters/color.js'))()
e.formatNpm = new (require('./formatters/npm.js'))()
e.formatLearnboost = new (require('./formatters/learnboost.js'))()
e.formatMinilog = new (require('./formatters/minilog.js'))()
e.formatWithStack = new (require('./formatters/withstack.js'))()
e.formatTime = new (require('./formatters/time.js'))()

exports.ConsoleBackend = ConsoleBackend
module.exports = e
