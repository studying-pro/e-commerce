import { Request, Response, NextFunction } from 'express'
import { logInfo, ILogging } from '../logger'
import { HEADER } from '~/v1/constants'
import { v4 as uuidv4 } from 'uuid'
export const loggerHandler = (req: Request, res: Response, next: NextFunction) => {
  const uuid = uuidv4()
  const requestId = req.headers[HEADER.REQUEST_ID] ? (req.headers[HEADER.REQUEST_ID] as string) : uuid
  if (!req.headers[HEADER.REQUEST_ID]) {
    req.headers[HEADER.REQUEST_ID] = requestId
  }
  const router = req.originalUrl
  const data: ILogging = {
    level: 'info',
    method: req.method,
    message: 'Request received',
    timestamp: new Date().toISOString(),
    requestId,
    context: 'loggerHandler',
    router,
    meta: {}
  }
  logInfo(data)
  next()
}
