import expressJWT, { UnauthorizedError } from 'express-jwt'
import { Request, Response, NextFunction } from './ownExpressTypes'
import * as config from './config'

const getToken = (req: Request): string => {
  if (req.headers && typeof req.headers.authorization === 'string') {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        return credentials
      }
    } else {
      throw new expressJWT.UnauthorizedError('credentials_bad_format', {
        message: 'Format is Authorization: Bearer [token]',
      })
    }
  } else if (req.method === 'GET' && req.query.access_token) {
    return String(req.query.access_token)
  } else if (req.body && req.body.access_token) {
    return req.body.access_token
  }
  return undefined
}

const jwtConfig = {
  secret: config.JWT_SECRET,
  algorithms: ['HS256'],
  getToken,
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const jwtMiddle = ({ required = true }: { required?: boolean }) => [
  (req: Request, res: Response, next: NextFunction): void | Response =>
    expressJWT({ ...jwtConfig, credentialsRequired: !!required })(
      req,
      res,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (err?: UnauthorizedError | 'router') => {
        if (err === 'router') {
          return next('router')
        }
        if (err?.name === 'UnauthorizedError') {
          if (err.code === 'credentials_required') {
            return res.status(400).json({ error: { code: 'UNAUTHORIZED' } })
          }
          if (err.code === 'revoked_token') {
            return res.status(400).json({ error: { code: 'TOKEN_EXPIRED' } })
          }
          return res.status(400).json({ error: { code: 'TOKEN_INVALID' } })
        }
        return next(err)
      }
    ),
]
