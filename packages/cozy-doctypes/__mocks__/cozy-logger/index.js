const logger = jest.fn()
logger.namespace = () => logger

module.exports = logger
