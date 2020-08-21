import minilog_ from 'minilog'

const inBrowser = typeof window !== 'undefined'
const minilog = (inBrowser && window.minilog) || minilog_

const logger = minilog(`cozy-sharing`)

minilog.suggest.deny(`cozy-sharing`, 'log')
minilog.suggest.deny(`cozy-sharing`, 'info')

export default logger
