import minilog from 'minilog'

const logger = minilog(`cozy-sharing`)
minilog.enable()

minilog.suggest.allow(`cozy-sharing`, 'log')
minilog.suggest.allow(`cozy-sharing`, 'info')

export default logger
