import { Request, Response, Router } from 'express'
import { asyncHandler } from '~/middlewares/error.handler'
import DataController from '~/v1/controllers/data.controller'

const dataRouter = Router()

dataRouter.get('', asyncHandler(DataController.generateData))

export default dataRouter
