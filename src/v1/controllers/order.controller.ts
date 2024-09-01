import { Request, Response } from 'express'
import { CreatedResponse, OKResponse } from '~/models/Success'
import { BadRequest } from '~/models/Error'
import orderService from '../services/order.service'
import cartService from '../services/cart.service'
import { HEADER } from '../constants'
import db from '~/db/init.mongo'
import { clearCache } from '~/utils/cache.utils'

class OrderController {
  async createOrder(req: Request, res: Response) {
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    if (!customerId) {
      throw new BadRequest('Customer ID is required')
    }
    const { address } = req.body
    await cartService.getCartByCustomerId(customerId)
    const client = await db.instance?.startSession()
    try {
      client?.withTransaction(async (session) => {
        const { order, reviewedCart } = await orderService.createOrder(customerId, address, session)
        await orderService.processOrder(order.id, reviewedCart, session)
        await session.commitTransaction()
        await clearCache(`reviewed_cart_${customerId}`)
        return new CreatedResponse('Order created successfully', order).send(res)
      })
    } catch (error) {
      await client?.abortTransaction()
      throw error
    }
  }

  async getOrderById(req: Request, res: Response) {
    const { orderId } = req.params
    const order = await orderService.getOrderById(orderId)
    return new OKResponse('Order retrieved successfully', order).send(res)
  }

  async getOrdersByCustomerId(req: Request, res: Response) {
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    if (!customerId) {
      throw new BadRequest('Customer ID is required')
    }
    const orders = await orderService.getOrdersByCustomerId(customerId)
    return new OKResponse('Orders retrieved successfully', orders).send(res)
  }
}

export default new OrderController()
