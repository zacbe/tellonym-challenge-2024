import { newChat, getNewestMessageId } from '../../src/logic/chats'
import * as TestPrep from '../testPreparation'
import * as db from '../../src/logic/db'

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

  describe('POST /deletenewestmessage', () => {
    it('returns 400 if userId is not provided', async () => {
      const response = await TestPrep.sendPostRequest({
        path: '/deletenewestmessage',
        jwtToken: validToken,
        postBody: {},
      })

      expect(response.status).toBe(400)
      expect(response.body.error.code).toBe('PARAMETER_INVALID')
    })

    it('returns 404 if chat with user is not found', async () => {
      const targetUserId = 5
      const response = await TestPrep.sendPostRequest({
        path: '/deletenewestmessage',
        postBody: { userId: targetUserId },
        jwtToken: validToken,
      })

      expect(response.status).toBe(404)
      expect(response.body.error.code).toBe('NOT_FOUND')
    })

    it('returns 404 if there are no messages to delete', async () => {
      const targetUserId = 5
      const response = await TestPrep.sendPostRequest({
        path: '/deletenewestmessage',
        postBody: { userId: targetUserId },
        jwtToken: validToken,
      })

      expect(response.status).toBe(404)
      expect(response.body.error.code).toBe('NOT_FOUND')
    })

    it('returns success if the newest message is deleted', async () => {
      const targetUserId = 5
      const message = 'Hello'

      const chatId = await newChat({ userId, targetUserId: 5 })
      // insert new message to chat
      await db.pool.query(
        'INSERT INTO chat_messages (chat_id, user_id, message) VALUES (?, ?, ?)',
        [chatId, userId, message]
      )

      const response = await TestPrep.sendPostRequest({
        path: '/deletenewestmessage',
        postBody: { userId: targetUserId },
        jwtToken: validToken,
      })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)

      // check if the message is deleted
      const messageId = await getNewestMessageId(chatId)
      expect(messageId).toBeNull()
    })
  })
})
