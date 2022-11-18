import devErrorHandler from 'errorhandler'
import * as config from './util/config'
import app from './app'
import errorHandler from './util/errorHandler'
import logger from './util/logger'
import * as db from './logic/db'

/**
 * Dev Error Handler. Provides full stack
 */
const setupApi = async (): Promise<void> => {
  return db.setup().catch(async (e) => {
    logger.error('Error while setting up the database for api-chat', {
      error: e,
    })
  })
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  app.use(devErrorHandler())
} else {
  /**
   * Error handler catches all errors
   */
  app.use(errorHandler)
}

const startApiListener = async (): Promise<void> =>
  new Promise((resolve) => {
    app.listen(config.PORT, () => {
      logger.info(
        'tellonym-api-chat is running at http://localhost:%d in %s mode',
        config.PORT,
        app.get('env')
      )
      return resolve()
    })
  })

/**
 * Start Express server.
 */
setupApi()
  .then(() => startApiListener())
  // eslint-disable-next-line no-console
  .catch((e) => console.log(e))
