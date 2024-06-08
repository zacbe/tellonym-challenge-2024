/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'
import { getChats, deleteNewestMessage } from '../logic/chats'
import { sendErrorResponse, ErrorCodes, NotFoundError } from '../util/errors'

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
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body

    if (!userId) {
      sendErrorResponse(res, 400, ErrorCodes.PARAMETER_INVALID)
      return
    }

    try {
      const success = await deleteNewestMessage({
        bodyUserId: userId,
        reqUserId: req.user.id,
      })

      if (!success) {
        sendErrorResponse(res, 404, ErrorCodes.NOT_FOUND)
        return
      }

      res.json({ success })
    } catch (error) {
      if (error instanceof NotFoundError) {
        sendErrorResponse(res, 404, ErrorCodes.NOT_FOUND)
      } else {
        sendErrorResponse(res, 500, ErrorCodes.INTERNAL_ERROR)
      }
    }
  })
)

export default router
