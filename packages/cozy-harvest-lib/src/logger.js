import minilog_ from 'minilog'

const inBrowser = typeof window !== 'undefined'
const minilog = (inBrowser && window.minilog) || minilog_

const logger = minilog('harvest')

minilog.suggest.allow('harvest', 'log')
minilog.suggest.allow('harvest', 'info')

export default logger
