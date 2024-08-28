import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import { validate } from '~/middlewares/validate'
import cartController from '~/v1/controllers/cart.controller'
import {
  AddProductToCartValidate,
  ReviewCartRequestValidate,
  UpdateCartValidate
} from '~/v1/validation/cart.validation'

const cartRouter = Router()

cartRouter.use(asyncHandler(authenticationHandler))

// cartRouter.get('/', asyncHandler(cartController.listProductsInCarts))
cartRouter.post('/add-to-cart', validate(AddProductToCartValidate), asyncHandler(cartController.addToCart))
// cartRouter.get('/get-cart', asyncHandler(cartController.getCart))
cartRouter.patch('/update', validate(UpdateCartValidate), asyncHandler(cartController.updateCart))
cartRouter.delete('/remove', asyncHandler(cartController.removeFromCart))
cartRouter.post('/review', validate(ReviewCartRequestValidate), asyncHandler(cartController.reviewCart))
// cartRouter.delete('/clear', asyncHandler(cartController.clearCart))

export default cartRouter
