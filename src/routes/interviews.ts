/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'
import {
  createUserInterview,
  getLatestUserInterviews,
  countUserInterviews,
} from '../logic/interviews'
import { sendErrorResponse, ErrorCodes } from '../util/errors'

const router = express.Router()

router.post(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { availability, phoneNumber, birthdate } = req.body

    if (!availability || !phoneNumber || !birthdate) {
      sendErrorResponse(res, 400, ErrorCodes.PARAMETER_INVALID)
      return
    }

    try {
      const interviewId = await createUserInterview({
        availability,
        phoneNumber,
        birthdate,
      })

      res.status(201).json({ interviewId })
    } catch (error) {
      sendErrorResponse(res, 500, ErrorCodes.INTERNAL_ERROR)
    }
  })
)

router.get(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string, 10) || 20

    try {
      const payload = await getLatestUserInterviews(limit)
      const totalInterviews = await countUserInterviews()
      const hasMore = totalInterviews > limit

      res.json({
        payload,
        meta: {
          hasMore,
        },
      })
    } catch (error) {
      sendErrorResponse(res, 500, ErrorCodes.INTERNAL_ERROR)
    }
  })
)

export default router
