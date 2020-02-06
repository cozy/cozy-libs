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

flag.store = store
flag.list = listFlags
flag.reset = resetFlags

export default flag
