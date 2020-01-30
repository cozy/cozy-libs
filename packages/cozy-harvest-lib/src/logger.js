import minilog_ from 'minilog'

const inBrowser = typeof window !== 'undefined'
const minilog = (inBrowser && window.minilog) || minilog_

const logger = minilog('cozy-harvest-lib')

minilog.suggest.allow('cozy-harvest-lib', 'log')
minilog.suggest.allow('cozy-harvest-lib', 'info')

export default logger
