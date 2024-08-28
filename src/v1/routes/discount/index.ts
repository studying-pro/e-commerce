import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import { validate } from '~/middlewares/validate'
import discountController from '~/v1/controllers/discount.controller'
import createDiscountRequestValidate from '~/v1/validation/discount.validation'

const discountRouter = Router()

discountRouter.use(asyncHandler(authenticationHandler))

// Create a new discount
discountRouter.post('/', validate(createDiscountRequestValidate), asyncHandler(discountController.createDiscount))

export default discountRouter
