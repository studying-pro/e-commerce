import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import orderController from '~/v1/controllers/order.controller'

const orderRouter = Router()

orderRouter.use(asyncHandler(authenticationHandler))

orderRouter.post('/', asyncHandler(orderController.createOrder))
orderRouter.get('/:orderId', asyncHandler(orderController.getOrderById))
orderRouter.get('/', asyncHandler(orderController.getOrdersByCustomerId))

export default orderRouter
