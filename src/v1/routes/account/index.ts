import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import { validate } from '~/middlewares/validate'
import accountController from '~/v1/controllers/account.controller'
import { validateLogin, validateRefreshToken, validateSignup } from '~/v1/validation/account.validation'

const accountRouter = Router()

accountRouter.post('/signup', validate(validateSignup), asyncHandler(accountController.signUp))
accountRouter.post('/login', validate(validateLogin), asyncHandler(accountController.login))
accountRouter.post('/refresh-token', validate(validateRefreshToken), asyncHandler(accountController.handleRefreshToken))

accountRouter.use(authenticationHandler)

accountRouter.delete('/logout', asyncHandler(accountController.logout))
export default accountRouter
