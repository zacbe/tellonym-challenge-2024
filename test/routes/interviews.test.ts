import * as TestPrep from '../testPreparation'

// Generate valid tokens at jwt.io with Algo HS256 and key 'abcdefg'
const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE0fQ.7xLgPyZxyLKL4EjznWd5dR9jH41V391pmBYURgp3T4w'

beforeAll(async () => TestPrep.emptyDb())

afterEach(async () => {
  await TestPrep.emptyDb()
})

describe('User Interview Route', () => {
  describe('POST /userinterview', () => {
    it('returns 201 if data is saved successfully', async () => {
      const body = {
        availability: '2024-01-10',
        phoneNumber: '123-456-7890',
        birthdate: '2000-01-01',
      }
      const response = await TestPrep.sendPostRequest({
        path: '/userinterview',
        postBody: body,
        jwtToken: validToken,
      })

      expect(response.status).toBe(201)
    })
  })

  describe('GET /userinterview', () => {
    it('returns an empty array if there are no user interviews', async () => {
      const response = await TestPrep.getGetHttpResponse({
        path: '/userinterview',
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.payload.ids).toHaveLength(0)
      expect(response.body.meta.hasMore).toBe(false)
    })
  })
})
