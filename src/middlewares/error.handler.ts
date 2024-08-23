import { Request, Response, NextFunction } from 'express'
import { StatusCode } from '~/constant/http-status'
import { ReasonPhrases } from '~/constant/message'
import { CustomError } from '~/models/Error'
import { CustomResponse } from '~/type'

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

const errorGloballyHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  const errMsg = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
  const errCode = err.code || StatusCode.INTERNAL_SERVER_ERROR
  return res.status(errCode).json({
    success: false,
    message: errMsg,
    code: errCode
  } as CustomResponse)
}

export { asyncHandler, errorGloballyHandler }
