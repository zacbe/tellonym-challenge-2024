/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'
import { getChats, deleteNewestMessage } from '../logic/chats'

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

    try {
      const response = await deleteNewestMessage({
        bodyUserId: userId,
        reqUserId: req.user.id,
      })

      if (!response) {
        return res.status(404).json({
          error: {
            message: 'Message not found',
            code: 'NOT_FOUND',
          },
        }) as unknown as void
      }

      return res.json({ success: response }) as unknown as void
    } catch (error) {
      return res.status(500).json({
        error: {
          message: 'Internal Server Error',
          code: 'INTERNAL_ERROR',
        },
      }) as unknown as void
    }
  })
)

export default router
