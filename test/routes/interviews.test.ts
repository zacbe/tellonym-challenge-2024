import * as TestPrep from '../testPreparation'

// Generate valid tokens at jwt.io with Algo HS256 and key 'abcdefg'
const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE0fQ.7xLgPyZxyLKL4EjznWd5dR9jH41V391pmBYURgp3T4w'

beforeAll(async () => TestPrep.emptyDb())

afterEach(async () => {
  await TestPrep.emptyDb()
})

describe('User Interview Route', () => {
  describe('POST /userinterview', () => {})
  describe('GET /userinterview', () => {})
})
