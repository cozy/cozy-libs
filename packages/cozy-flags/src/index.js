/* global __ENABLED_FLAGS__ */

import flag from './flag'

if (typeof window !== 'undefined') {
  flag.connect = require('./connect').default
  flag.FlagSwitcher = require('./FlagSwitcher').default
}

if (typeof __ENABLED_FLAGS__ !== 'undefined') {
  flag.enable(__ENABLED_FLAGS__)
}

module.exports = flag
