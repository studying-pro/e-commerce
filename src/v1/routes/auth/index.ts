import { Router } from 'express'
import authController from '~/v1/controllers/auth.controller'

const router = Router()

router.get('/verify-otp', authController.verifyOtp)

export default router
