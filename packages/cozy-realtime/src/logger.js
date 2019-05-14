import minilog_ from 'minilog'

const minilog = (typeof window !== undefined && window.minilog) || minilog_
const logger = minilog('cozy-realtime')
minilog.suggest.deny('cozy-realtime', 'info')

export default logger
