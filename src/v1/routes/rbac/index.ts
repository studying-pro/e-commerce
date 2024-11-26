import { Router } from 'express'
import { asyncHandler } from '~/middlewares/error.handler'
import { validate } from '~/middlewares/validate'
import RbacController from '~/v1/controllers/rbac.controller'
import { validateCreatingRBAC } from '~/v1/validation/rbac.validation'

const rbacRouter = Router()

rbacRouter.post('/', validate(validateCreatingRBAC), asyncHandler(RbacController.createRbac))
export default rbacRouter
