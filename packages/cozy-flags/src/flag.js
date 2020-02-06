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

/**
 * Initializes flags from the remote endpoint serving instance flags
 *
 * @private
 * @see  https://docs.cozy.io/en/cozy-stack/settings/#get-settingsflags
 * @param  {CozyClient} client
 */
export const initializeFromRemote = async client => {
  const {
    data: { attributes }
  } = await client.stackClient.fetchJSON('/settings/flags')
  enable(attributes)
}

const capitalize = str => str[0].toUppercase() + str.slice(1)

export const getTemplateData = attr => {
  if (typeof document === 'undefined') {
    return null
  }
  const allDataNode = document.querySelector('[data-cozy]')
  const attrNode = document.querySelector(`[data-cozy-${attr}]`)
  try {
    if (allDataNode) {
      return JSON.parse(allDataNode.dataset.cozy)[attr]
    } else if (attrNode) {
      // eslint-disable-next-line no-console
      console.warn(
        'Prefer to use [data-cozy] to store template data. <div data-cozy="{{.CozyData}}></div>. "'
      )
      return JSON.parse(attrNode.dataset[`cozy${capitalize(attr)}`])
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

/**
 * Initialize from the template data injected by cozy-stack into the DOM
 *
 * @private
 * @see https://docs.cozy.io/en/cozy-stack/client-app-dev/#good-practices-for-your-application
 *
 * @returns {Boolean} - False is DOM initialization could not be completed, true otherwise
 */
export const initializeFromDOM = async () => {
  const domData = getTemplateData('flags')
  if (!domData) {
    return false
  }
  enable(domData)
  return true
}

/**
 * Initialize flags from DOM if possible, otherwise from remote endpoint
 *
 * @example
 *
 * Flags can be taken from the flags injected by the stack
 * ```
 * <div data-cozy="{{ .CozyData }}"></div>
 *
 * // not recommended but possible
 * <div data-flags="{{ .Flags }}"></div>
 * ````
 *
 * @param  {CozyClient} client - A CozyClient
 * @return {Promise} Resolves when flags have been initialized
 */
export const initialize = async client => {
  const domRes = await initializeFromDOM()
  if (domRes == false) {
    await initializeFromRemote(client)
  }
}

class FlagClientPlugin {
  constructor(client) {
    this.client = client
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.client.on('login', this.handleLogin)
    this.client.on('logout', this.handleLogout)
  }

  async handleLogin() {
    await flag.initialize(this.client)
  }

  async handleLogout() {
    flag.reset()
  }
}

FlagClientPlugin.pluginName = 'flags'

flag.store = store
flag.list = listFlags
flag.reset = resetFlags
flag.enable = enable
flag.initializeFromRemote = initializeFromRemote
flag.initializeFromDOM = initializeFromDOM
flag.initialize = initialize
flag.plugin = FlagClientPlugin

export default flag
