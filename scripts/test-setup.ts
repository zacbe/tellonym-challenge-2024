import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

// eslint-disable-next-line import/first
import * as db from '../src/logic/db'

db.setup()
