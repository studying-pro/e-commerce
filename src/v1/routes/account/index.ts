import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import accountController from '~/v1/controllers/account.controller'

const accountRouter = Router()

accountRouter.post('/signup', asyncHandler(accountController.signUp))
accountRouter.post('/login', asyncHandler(accountController.login))
accountRouter.post('/refresh-token', asyncHandler(accountController.handleRefreshToken))

accountRouter.use(authenticationHandler)

accountRouter.delete('/logout', asyncHandler(accountController.logout))
export default accountRouter
