import winston, { Logger } from 'winston'

const chooseEnv = <T>(options: {
  production?: T
  development?: T
  staging?: T
  testing?: T
  test?: T
}): T => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return options.production
    case 'development':
      return options.development
    case 'testing':
      return options.testing || options.production
    case 'test':
      return options.test
    default:
      return options.production
  }
}

const logger = new Logger({
  transports: [
    new winston.transports.Console({
      level: chooseEnv({
        production: 'info',
        development: 'debug',
        test: 'error',
      }),
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true,
      timestamp: true,
    }),
    ...(process.env.NODE_ENV === 'production'
      ? []
      : [
          new winston.transports.File({
            filename: 'debug.log',
            level: 'debug',
          }),
        ]),
  ],
})

export const eventLogger = new Logger({
  transports: [
    ...(process.env.NODE_ENV === 'production'
      ? []
      : [
          new winston.transports.File({
            filename: 'events.log',
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            json: true,
            timestamp: true,
          }),
        ]),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.debug(`Logging initialized at ${logger.level} level`)
}

export default logger
