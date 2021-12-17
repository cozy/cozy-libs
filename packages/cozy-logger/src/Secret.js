const Secret = function(data) {
  Object.assign(this, data)
  return this
}

Secret.prototype.toString = function() {
  throw new Error('Cannot convert Secret to string')
}

module.exports = Secret
