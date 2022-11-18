/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { OkPacket, RowDataPacket } from 'mysql2'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'
import { getChats } from '../logic/chats'
import * as db from '../logic/db'

const router = express.Router()

router.get(
  '/chats',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit, oldestId } = req.query as {
      limit?: number
      oldestId?: number
    }

    const chats = await getChats({
      userId: req.user.id,
      limit,
      oldestId,
    })

    res.json({
      unreadCount: 0,
      chats: chats.map((chat) => ({
        id: chat.id,
        participants: chat.users,
      })),
    })
  })
)

router.post(
  '/deletenewestmessage',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        error: {
          message: 'userId is required',
          code: 'PARAMETER_INVALID',
        },
      }) as unknown as void
    }

    const allChats = await getChats({
      userId: req.user.id,
    })
    const chat = allChats.find((_chat) => _chat.users.includes(userId))

    if (!chat) {
      return res.status(404).json({
        error: {
          message: 'Chat with user not found',
          code: 'NOT_FOUND',
        },
      }) as unknown as void
    }

    const [messages] = await db.pool.query<RowDataPacket[]>({
      sql: `SELECT id FROM chat_messages WHERE chat_id = :chatId ORDER BY id DESC LIMIT 1`,
      values: {
        chatId: chat.id,
      },
    })

    const [deletionResult] = await db.pool.query<OkPacket>({
      sql: `DELETE FROM chat_messages WHERE id = :messageId`,
      values: {
        messageId: messages[0]?.id ?? 0,
      },
    })

    return res.json({
      success: deletionResult.affectedRows > 0,
    }) as unknown as void
  })
)

export default router
