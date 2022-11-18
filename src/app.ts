/* eslint-disable import/no-default-export */
import express from 'express'
import lusca from 'lusca'
import bodyParser from 'body-parser'
import { NextFunction, Request, Response } from './util/ownExpressTypes'
import { notFoundRoute } from './routes/notFoundRoute'
import logger from './util/logger'
import chatsRoutes from './routes/chats'

// Create Express server
const app = express()

/** ######## start monkypatch for original route ######## */
// by https://github.com/expressjs/express/issues/2501#issue-54566335
const { Router } = express as unknown as {
  Router: ((options?: express.RouterOptions) => express.Router) & {
    process_params: (
      layer: { path: string },
      _called: boolean,
      req: Request
    ) => unknown
  }
}
const OriginalRouterProcessParams = Router.process_params
// eslint-disable-next-line func-names
Router.process_params = function (
  layer: { path: string },
  _called: boolean,
  req: Request
): unknown {
  const routeOrLayerPath = (req.route && req.route.path) || layer.path || ''
  if (req.originalRoute && req.originalRoute.includes(routeOrLayerPath)) {
    // eslint-disable-next-line prefer-rest-params
    return OriginalRouterProcessParams.apply(this, [...arguments])
  }
  req.originalRoute = (req.originalRoute || '') + routeOrLayerPath
  // eslint-disable-next-line prefer-rest-params
  return OriginalRouterProcessParams.apply(this, [...arguments])
}
/** ######## end monkypatch for original route ######## */

// Express configuration
app.set('port', process.env.PORT || 3025)
app.set('wsport', process.env.WSPORT || 3030)
app.use((req: Request, res: Response, next: NextFunction) => {
  req.startTime = process.hrtime()
  return next()
})
app.use(bodyParser.json({ limit: '300kb' }))
app.use(lusca.xframe('DENY'))
app.disable('x-powered-by')

if (
  process.env.NODE_ENV === 'testing' ||
  process.env.NODE_ENV === 'development'
) {
  // app.disable('etag')
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.startTime = process.hrtime()
    const originalEnd = res.end

    const modifiedEndFn = ((
      ...args: Parameters<Response['end']>
    ): ReturnType<Response['end']> => {
      const elapsedHrTime = process.hrtime(req.startTime)
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
      logger.debug('request details', {
        request: {
          body: req.body,
          query: req.query,
          url: `${req.method.toUpperCase()} ${req.originalUrl}`,
          user: req.user?.id ?? undefined,
        },
        response: {
          size:
            res.getHeader('Content-Length') ||
            // eslint-disable-next-line no-underscore-dangle
            (res as unknown as { _contentLength: number })._contentLength,
          code: res.statusCode,
          time: `${elapsedTimeInMs.toFixed(3)}ms`,
          // content: body,
        },
      })
      return originalEnd.call(res, ...args)
    }) as Response['end']
    res.end = modifiedEndFn

    return next()
  })
}

/**
 * Primary app routes.
 */
app.use(chatsRoutes)
app.get('/info', (req, res) => res.end())
app.use(notFoundRoute)

export default app
