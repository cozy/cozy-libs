import FlagStore from './store'

const store = new FlagStore()

/**
 * Public API to use flags
 */
const flag = function() {
  const args = [].slice.call(arguments)
  if (args.length === 1) {
    return store.get(args[0])
  } else {
    store.set(args[0], args[1])
    return args[1]
  }
}

export const listFlags = () => {
  return store.keys().sort()
}

export const resetFlags = () => {
  listFlags().forEach(name => store.remove(name))
}

/**
 * Enables a list of flags
 *
 * Supports passing either
 * - an array containing flag names (in this case, flag values will be true)
 * - or an object flagName -> flagValue
 *
 * @param {string[]|Object} flagsToEnable
 */
export const enable = flagsToEnable => {
  let flagNameToValue
  if (Array.isArray(flagsToEnable)) {
    flagNameToValue = flagsToEnable.map(flagName => [flagName, true])
  } else if (typeof flagsToEnable === 'object') {
    flagNameToValue = Object.entries(flagsToEnable)
  }

  if (!flagNameToValue) {
    return
  }

  for (const [flagName, flagValue] of flagNameToValue) {
    flag(flagName, flagValue)
  }
}

export const initializeFromRemote = async client => {
  const {
    data: { attributes }
  } = await client.stackClient.fetchJSON('/settings/flags')
  enable(attributes)
}

flag.store = store
flag.list = listFlags
flag.reset = resetFlags
flag.enable = enable
flag.initializeFromRemote = initializeFromRemote

export default flag
