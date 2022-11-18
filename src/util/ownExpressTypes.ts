import {
  Request as ERequest,
  Response as EResponse,
  NextFunction as ENextFunction,
} from 'express'

export interface Request extends ERequest {
  startTime: [number, number]
  user?: {
    id: number
  }
  originalRoute: ERequest['route']
  apiClient?: {
    os: string
    version: string
    buildNumber?: string
    platformVersion?: string
    deviceId?: string
  }
}
export interface Response extends EResponse {
  /** Sentry Error ID if error was catched */
  sentry?: string
  apiCode?: string
}

export type NextFunction = ENextFunction
