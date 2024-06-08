import { Response } from '../ownExpressTypes'
import { BadRequestError } from './BadRequestError'
import { NotFoundError } from './NotFoundError'

enum ErrorCodes {
  PARAMETER_INVALID = 'PARAMETER_INVALID',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.PARAMETER_INVALID]: 'Invalid parameters provided.',
  [ErrorCodes.NOT_FOUND]: 'Resource not found.',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal Server Error.',
}

const sendErrorResponse = (
  res: Response,
  status: number,
  code: ErrorCodes
): void => {
  res.status(status).json({
    error: {
      message: ErrorMessages[code],
      code,
    },
  })
}

export { sendErrorResponse, ErrorCodes, BadRequestError, NotFoundError }
