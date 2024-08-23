import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { BadRequest } from '~/models/Error'

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error) {
      throw new BadRequest(error.details[0].message)
    }
    next()
  }
}

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query)
    if (error) {
      throw new BadRequest(error.details[0].message)
    }
    next()
  }
}
