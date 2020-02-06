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

/** List all flags from the store */
export const listFlags = () => {
  return store.keys().sort()
}

/** Resets all the flags */
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

export const getTemplateData = attr => {
  const allDataNode = document.querySelector('[data-cozy]')
  const attrNode = document.querySelector(`[data-${attr}]`)
  try {
    if (allDataNode) {
      return JSON.parse(allDataNode.dataset.cozy)[attr]
    } else if (attrNode) {
      console.warn(
        'Prefer to use [data-cozy] to store template data. <div data-cozy="{{.CozyData}}></div>. "'
      )
      return JSON.parse(attrNode.dataset[attr])
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export const initializeFromDOM = client => {
  const domData = getTemplateData('flags')
  if (!domData) {
    console.warn('no dom daa')
    return
  }
  for (const [flagName, flagValue] of Object.entries(domData)) {
    flag(flagName, flagValue)
  }
}

flag.store = store
flag.list = listFlags
flag.reset = resetFlags
flag.enable = enable
flag.initializeFromRemote = initializeFromRemote
flag.initializeFromDOM = initializeFromDOM

export default flag
