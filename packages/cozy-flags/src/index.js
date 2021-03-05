/* global __ENABLED_FLAGS__ */

import flag from './flag'

if (typeof __ENABLED_FLAGS__ !== 'undefined') {
  flag.enable(__ENABLED_FLAGS__)
}

module.exports = flag
