/* eslint-disable import/no-default-export */
import { Errback } from 'express'
import { NextFunction, Request, Response } from './ownExpressTypes'

export default (
  err: Errback,
  req: Request,
  res: Response,
  _next: NextFunction
): void | Response => {
  if (res.headersSent) {
    return undefined
  }
  if (req.accepts('html', 'json') === 'html') {
    res.setHeader('Error-Id', res.sentry || '0')
    return res.status(500).send()
  }
  if (req.headers['tellonym-client']) {
    return res.status(500).json({
      err: {
        code: 'INTERNAL_SERVER_ERROR',
        msg: 'Internal Server Error',
        errorId: res.sentry || 'INTERNAL_SERVER_ERROR',
      },
    })
  }
  return res.end()
}
