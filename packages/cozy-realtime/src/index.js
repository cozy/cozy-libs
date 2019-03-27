import { subscribe as subscribeLegacy } from './legacy'
import CozyRealtime from './CozyRealtime'

export { CozyRealtime }

export default {
  // Legacy
  subscribe: (...args) => {
    console.warn(
      'CozyRealtime.subscribe() is deprecated, please create a CozyRealtime instance with CozyRealtime.init()'
    )
    return subscribeLegacy(...args)
  },
  init: options => {
    return new CozyRealtime(options)
  }
}
