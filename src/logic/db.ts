// eslint-disable-next-line import/no-extraneous-dependencies
import * as mysql from 'mysql2/promise'
import * as config from '../util/config'

// eslint-disable-next-line import/no-mutable-exports
export let pool: mysql.Pool

export const setup = (): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      pool = mysql.createPool({
        host: config.DB.host,
        user: config.DB.user,
        password: config.DB.password,
        database: config.DB.database,
        namedPlaceholders: true,
      })
      resolve()
    } catch (e) {
      reject(e)
    }
  })
