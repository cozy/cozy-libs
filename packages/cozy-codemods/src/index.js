const findNearest = require('./find-nearest')
const hoc = require('./hoc')
const imports = require('./imports')
const jsx = require('./jsx')
const replaceBooleanVars = require('./replace-boolean-vars')
const simplifyConditions = require('./simplify-conditions')

module.exports = {
  hoc,
  imports,
  jsx,
  replaceBooleanVars,
  simplifyConditions,
  findNearest
}
