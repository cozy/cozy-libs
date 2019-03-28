/* global localStorage */

export const prefix = 'flag__'
export const getKey = name => prefix + name

const listFlagLocalStorage = () => {
  return Object.keys(localStorage)
    .filter(x => x.indexOf(prefix) === 0)
    .map(x => x.replace(prefix, ''))
}

/**
 * In memory key value storage.
 *  - Saves to localStorage when a key is set
 *  - When instantiated, will try to fill from localStorage
 *  - Emits `change` when a key is set (eventEmitter)
 */
class FlagStore {
  constructor() {
    this.fillFromLocalStorage()
  }

  fillFromLocalStorage() {
    const flags = listFlagLocalStorage()
    this.store = {}
    for (let flag of flags) {
      const val = localStorage.getItem(getKey(flag))
      this.store[flag] = val ? JSON.parse(val) : val
    }
  }

  keys() {
    return Object.keys(this.store)
  }

  get(name) {
    if (!this.store.hasOwnProperty(name)) {
      this.store[name] = null
    }
    return this.store[name]
  }

  set(name, value) {
    if (window.localStorage) {
      localStorage.setItem(getKey(name), JSON.stringify(value))
    }
    this.store[name] = value
  }
}

const store = new FlagStore()
const flag = function() {
  if (!window.localStorage) {
    return
  }
  const args = [].slice.call(arguments)
  if (args.length === 1) {
    return store.get(args[0])
  } else {
    store.set(args[0], args[1])
    return args[1]
  }
}

export const listFlags = () => {
  return store.keys()
}

export const resetFlags = () => {
  listFlags().forEach(name => (store[name] = null))
}

flag.store = store
flag.list = listFlags
flag.reset = resetFlags

export default flag
