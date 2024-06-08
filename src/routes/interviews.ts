/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'
import { createUserInterview } from '../logic/interviews'

const router = express.Router()

router.post(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { availability, phoneNumber, birthdate } = req.body

    if (!availability || !phoneNumber || !birthdate) {
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
      res.status(500).json({ error: error.message })
    }
  })
)

router.get(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string, 10) || 20

    try {
      // implement the logic here
      const response = {
        payload: {},
        meta: {
          hasMore: true,
        },
      }

      res.json({ message: 'userinterview' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
)

export default router
