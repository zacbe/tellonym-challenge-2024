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

    const response = await deleteNewestMessage({
      bodyUserId: userId,
      reqUserId: req.user.id,
    })

    return res.json({ success: response }) as unknown as void
  })
)

export default router
