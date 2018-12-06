export { default as FlagSwitcher } from './browser/FlagSwitcher'

const flag = global ? require('./node/flag') : require('./browser/flag')

export default flag
