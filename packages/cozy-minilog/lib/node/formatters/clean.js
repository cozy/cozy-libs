var Transform = require('../../common/transform.js')

function FormatClean() {}

Transform.mixin(FormatClean)

FormatClean.prototype.write = function (name, level, args) {
  // eslint-disable-next-line no-unused-vars
  function pad(s) {
    return s.toString().length == 1 ? '0' + s : s
  }
  this.emit(
    'item',
    (name ? name + ' ' : '') + (level ? level + ' ' : '') + args.join(' ')
  )
}

module.exports = FormatClean
