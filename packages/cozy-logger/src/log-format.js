const devFormat = require('./dev-format')
const prodFormat = require('./prod-format')

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = prodFormat
    break
  case 'development':
    module.exports = devFormat
    break
  case 'standalone':
    module.exports = devFormat
    break
  case 'test':
    module.exports = devFormat
    break
  default:
    module.exports = prodFormat
}
