import { newChat } from '../../src/logic/chats'
import * as TestPrep from '../testPreparation'

// generate other valid tokens at jwt.io with Algo HS256 and key 'abcdefg'
const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE0fQ.7xLgPyZxyLKL4EjznWd5dR9jH41V391pmBYURgp3T4w'
const userId = 114

beforeAll(async () => TestPrep.emptyDb())

afterEach(async () => TestPrep.emptyDb())

describe('Chat routes', () => {
  describe('GET /chats', () => {
    it('returns empty array if chat data does not exist', async () => {
      const response = await TestPrep.getGetHttpResponse({
        path: `/chats`,
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.chats).toHaveLength(0)
    })

    it('returns correct chat data', async () => {
      await newChat({ userId, targetUserId: 5 })

      const response = await TestPrep.getGetHttpResponse({
        path: `/chats`,
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.chats).toHaveLength(1)
    })
  })
})
