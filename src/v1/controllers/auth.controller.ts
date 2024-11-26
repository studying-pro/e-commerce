import { Request, Response } from 'express'
import { verifyOtp } from '../services/auth.service'
import { OKResponse } from '~/models/Success'

class AuthController {
  async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.query
    const data = await verifyOtp(email as string, otp as string)
    return new OKResponse('OTP verified successfully', data).send(res)
  }
}

export default new AuthController()
