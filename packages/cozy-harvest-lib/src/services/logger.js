// We are not using `src/logger.js` here, as we need to handle stack's log format,
// and it doesn't do this.
import logger from 'cozy-logger'

logger.namespace('cozy-harvest-lib')

export default logger
