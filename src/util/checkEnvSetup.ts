import { config } from 'dotenv'
import { exists } from './paths'
import logger from './logger'

export const checkEnvSetup = (): void => {}

if (process.env.NODE_ENV === 'test' && exists('.env.test')) {
  config({ path: './.env.test' })
} else if (process.env.NODE_ENV !== 'test' && exists('.env')) {
  logger.debug('Using .env file to supply config environment variables')
  config()
} else if (exists('.env.example') && process.env.NODE_ENV !== 'production') {
  logger.debug('Using .env.example file to supply config environment variables')
  config({ path: '.env.example' })
}
