import { RowDataPacket } from 'mysql2'
import * as TestPrep from '../testPreparation'
import * as db from '../../src/logic/db'
import { createUserInterview } from '../../src/logic/interviews'

// Generate valid tokens at jwt.io with Algo HS256 and key 'abcdefg'
const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE0fQ.7xLgPyZxyLKL4EjznWd5dR9jH41V391pmBYURgp3T4w'

beforeAll(async () => TestPrep.emptyDb())

afterEach(async () => {
  await TestPrep.emptyDb()
})

describe('User Interview Route', () => {
  describe('POST /userinterview', () => {
    it('returns 400 if any field is missing', async () => {
      const response = await TestPrep.sendPostRequest({
        path: '/userinterview',
        postBody: { availability: '2024-01-10' },
        jwtToken: validToken,
      })

      expect(response.status).toBe(400)
      expect(response.body.error.code).toBe('PARAMETER_INVALID')
    })

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
      expect(response.body.interviewId).toBeDefined()

      const { interviewId } = response.body

      const [rows] = await db.pool.query<RowDataPacket[]>({
        sql: `SELECT * 
              FROM user_interviews 
              WHERE id = :interviewId`,
        values: { interviewId },
      })
      expect(rows).toHaveLength(1)
      expect(rows[0].id).toBe(interviewId)
    })
  })

  describe('GET /userinterview', () => {
    it('returns the latest user interviews with a specified limit', async () => {
      const limit = 5
      const records = 6
      for (let i = 1; i <= records; i++) {
        // eslint-disable-next-line no-await-in-loop
        await createUserInterview({
          availability: `2024-01-${i.toString().padStart(2, '0')}`,
          phoneNumber: `123-456-78${i.toString().padStart(2, '0')}`,
          birthdate: `2000-01-${i.toString().padStart(2, '0')}`,
        })
      }

      const response = await TestPrep.getGetHttpResponse({
        path: `/userinterview?limit=${limit}`,
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.payload.ids).toHaveLength(limit)
      expect(response.body.meta.hasMore).toBe(true)
    })

    it('returns no more entries when limit exceeds total entries', async () => {
      const limit = 5
      const records = 4
      for (let i = 1; i <= records; i++) {
        // eslint-disable-next-line no-await-in-loop
        await createUserInterview({
          availability: `2024-01-${i.toString().padStart(2, '0')}`,
          phoneNumber: `123-456-78${i.toString().padStart(2, '0')}`,
          birthdate: `2000-01-${i.toString().padStart(2, '0')}`,
        })
      }

      const response = await TestPrep.getGetHttpResponse({
        path: `/userinterview?limit=${limit}`,
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.payload.ids).toHaveLength(records)
      expect(response.body.meta.hasMore).toBe(false)
    })

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
