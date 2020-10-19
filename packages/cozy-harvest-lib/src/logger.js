import minilog_ from '@cozy/minilog'

const inBrowser = typeof window !== 'undefined'
const minilog = (inBrowser && window.minilog) || minilog_

const logger = minilog('harvest')

minilog.suggest.deny('harvest', 'info')

export default logger
