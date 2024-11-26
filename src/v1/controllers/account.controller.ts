import { Request, Response } from 'express'
import AccountService from '../services/account.service'
import { CreatedResponse, OKResponse } from '~/models/Success'
import { HEADER } from '../constants'

class AccountController {
  async logout(req: Request, res: Response) {
    await AccountService.logout(req.headers[HEADER.KEY_STORE_ID] as string)
    return new OKResponse('User logged out successfully', null).send(res)
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body

    const data = await AccountService.login(email, password)

    return new OKResponse('User logged in successfully', data).send(res)
  }
  async signUp(req: Request, res: Response) {
    const { email } = req.body

    const data = await AccountService.signUp(email)
    return new CreatedResponse('User created successfully', data).send(res)
  }

  async handleRefreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body

    const data = await AccountService.handleRefreshToken(refreshToken)

    return new OKResponse('Token refreshed successfully', data).send(res)
  }
}

export default new AccountController()
