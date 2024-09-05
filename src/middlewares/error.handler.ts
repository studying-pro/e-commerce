import { Request, Response, NextFunction } from 'express'
import { StatusCode } from '~/constant/http-status'
import { ReasonPhrases } from '~/constant/message'
import { CustomError } from '~/models/Error'
import { CustomResponse } from '~/type'
import { logError, ILogging } from '../logger'
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

const errorGloballyHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const errMsg = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
  const errCode = err.code || StatusCode.INTERNAL_SERVER_ERROR
  const data: ILogging = {
    level: 'error',
    message: `${errCode} ${errMsg}`,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] as string,
    context: 'errorGloballyHandler',
    router: req.originalUrl,
    meta: {
      ...(req.method === 'POST' ? { body: req.body } : { param: req.params })
    }
  }
  logError(data)
  return res.status(errCode).json({
    success: false,
    message: errMsg,
    code: errCode
  } as CustomResponse)
}

export { asyncHandler, errorGloballyHandler }
