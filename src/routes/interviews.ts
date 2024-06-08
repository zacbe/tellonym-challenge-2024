/* eslint-disable import/no-default-export */
import express from 'express'
import asyncHandler from 'express-async-handler'
import { Request, Response } from '../util/ownExpressTypes'
import { jwtMiddle } from '../util/jwtMiddleware'

const router = express.Router()

router.post(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ message: 'userinterview' })
  })
)

router.get(
  '/userinterview',
  jwtMiddle({ required: true }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ message: 'userinterview' })
  })
)

export default router
