import { OkPacket, RowDataPacket } from 'mysql2'
import * as db from './db'

/**
 * returns the chatId of the chat between the two users
 */
export const newChat = async ({
  userId,
  targetUserId,
}: {
  userId: number
  targetUserId: number
}): Promise<number> => {
  const [dbResult] = await db.pool.query<OkPacket>(
    'INSERT INTO chats (user_a, user_b) VALUES (?, ?)',
    [userId, targetUserId]
  )

  return dbResult.insertId
}

export const getChats = async ({
  userId,
  limit = 10,
  oldestId,
}: {
  userId: number
  limit?: number
  oldestId?: number
}): Promise<
  {
    id: number
    users: number[]
  }[]
> => {
  const [dbResults] = await db.pool.query<RowDataPacket[]>({
    sql: `SELECT id, user_a, user_b
          FROM chats
          WHERE user_a = :userId OR user_b = :userId
          ${oldestId ? 'AND id < :oldestId' : ''}
          ORDER BY id DESC
          LIMIT :limit`,
    values: {
      userId,
      limit,
      oldestId,
    },
  })

  return dbResults.map((dbResult) => ({
    id: dbResult.id,
    users: [dbResult.user_a, dbResult.user_b],
  }))
}

export const deleteMessageById = async (
  messageId: number
): Promise<boolean> => {
  const [deletionResult] = await db.pool.query<OkPacket>({
    sql: `DELETE FROM chat_messages 
          WHERE id = :messageId`,
    values: { messageId },
  })

  return deletionResult.affectedRows > 0
}

export const getNewestMessageId = async (
  chatId: number
): Promise<number | null> => {
  const [messages] = await db.pool.query<RowDataPacket[]>({
    sql: `SELECT id 
          FROM chat_messages 
          WHERE chat_id = :chatId 
          ORDER BY id DESC 
          LIMIT 1`,
    values: { chatId },
  })

  return messages.length ? messages[0].id : null
}

export const deleteNewestMessage = async ({
  bodyUserId,
  reqUserId,
}: {
  bodyUserId: number
  reqUserId: number
}): Promise<boolean> => {
  const allChats = await getChats({ userId: reqUserId })
  const chat = allChats.find((_chat) => _chat.users.includes(bodyUserId))

  if (!chat) {
    // introduce custom error class to handle this
    // e.g. NotFoundError
    throw new Error('Chat with user not found')
  }

  const messageId = await getNewestMessageId(chat.id)

  if (!messageId) {
    return false
  }

  return deleteMessageById(messageId)
}
