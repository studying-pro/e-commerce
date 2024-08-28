import { Request, Response } from 'express'
import { CreatedResponse, OKResponse } from '~/models/Success'
import { HEADER } from '../constants'
import { BadRequest } from '~/models/Error'
import cartService from '../services/cart.service'
class CartController {
  async addToCart(req: Request, res: Response) {
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    if (!customerId) {
      throw new BadRequest('Customer ID is required')
    }
    const { productId, quantity } = req.body
    const cart = await cartService.addToCart(productId, quantity, customerId)
    return new CreatedResponse('Cart added successfully', cart).send(res)
  }

  async updateCart(req: Request, res: Response) {
    const body = req.body
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    if (!customerId) {
      throw new BadRequest('Customer ID is required')
    }
    const cart = await cartService.updateCart({
      ...body,
      customerId
    })
    return new OKResponse('Cart updated successfully', cart).send(res)
  }

  async removeFromCart(req: Request, res: Response) {
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    const { productIds } = req.body
    const cart = await cartService.removeFromCart(productIds, customerId)
    return new OKResponse('Cart removed successfully', cart).send(res)
  }

  async reviewCart(req: Request, res: Response) {
    const { productDiscounts, address } = req.body
    const customerId = req.headers[HEADER.CLIENT_ID] as string
    if (!customerId) {
      throw new BadRequest('Customer ID is required')
    }
    const data = await cartService.reviewCarts(customerId, productDiscounts, address)
    return new OKResponse('Cart reviewed successfully', data).send(res)
  }
}

export default new CartController()
