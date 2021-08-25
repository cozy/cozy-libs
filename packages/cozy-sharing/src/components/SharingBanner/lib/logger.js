import minilog from '@cozy/minilog'

const logger = minilog(`cozy-${window.__APP_SLUG__ || 'app'}`)
minilog.enable()

minilog.suggest.allow(`cozy-${window.__APP_SLUG__ || 'app'}`, 'log')
minilog.suggest.allow(`cozy-${window.__APP_SLUG__ || 'app'}`, 'info')

export default logger
