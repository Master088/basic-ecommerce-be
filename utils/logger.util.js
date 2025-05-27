const { createLogger } = require('winston')
const { loggerOptions } = require('../config/app.config')
const logger = createLogger(loggerOptions)

module.exports = logger
