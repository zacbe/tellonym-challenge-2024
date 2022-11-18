import { NextFunction, Request, Response } from '../util/ownExpressTypes'

export const notFoundRoute = (
  req: Request,
  res: Response,
  _next: NextFunction
): void | Response => {
  if (res.headersSent) {
    return undefined
  }
  if (req.accepts('html', 'json') === 'html') {
    return res.redirect(`https://tellonym.me${req.originalUrl}`)
  }
  return res.status(404).json({
    err: {
      code: 'NOT_FOUND',
      msg: 'Route not found',
    },
  })
}
