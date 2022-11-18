import './checkEnvSetup'
import * as packageJson from '../package.json'

export { packageJson }
export const ENV = process.env.NODE_ENV
export const DEV = ENV !== 'production' && ENV !== 'test'

export const PORT = Number(process.env.PORT) || 3025

export const chooseEnv = <T>(config: { [s: string]: T }): T => {
  return config[ENV]
}

export const VERSION = packageJson.version

export const JWT_SECRET = process.env.JWTSECRET || 'abcdefg'

export const DB = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tellonym',
  password: process.env.DB_PASSWORD || 'tellonym',
  database: process.env.DB_NAME || 'tellonym_testing',
}
