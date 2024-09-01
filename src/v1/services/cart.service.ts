import { NotFound } from '~/models/Error'
import { ICart, CartModel, ICartProduct, IUpdateCartProduct, ICartDocument } from '../models/cart/carts.model'
import {
  addToCart,
  createCart,
  getCartByCustomerId,
  removeFromCart,
  reviewCarts,
  updateCart
} from '../repositories/cart.repository'
import mongoose from 'mongoose'
import inventoryService from './inventory.service'
import { queueOrderRequest } from '~/utils/redisQueue'
import { getOrSetCache, setCache } from '~/utils/cache.utils'

interface ICartService {
  createCart(customerId: string): Promise<ICart>
  addToCart(productId: string, quantity: number, customerId: string, name: string, price: number): Promise<ICart>
  removeFromCart(productId: string[], customerId: string): Promise<ICart>
  updateCart(payload: IUpdateCartProduct): Promise<ICart>
  getCartByCustomerId(customerId: string): Promise<ICartDocument>
  reviewCarts(
    customerId: string,
    productDiscounts: {
      productId: string
      discountCode: string
    }[],
    address: string
  ): Promise<any>
}

class CartService implements ICartService {
  async createCart(customerId: string): Promise<ICart> {
    return createCart(customerId)
  }
  async addToCart(productId: string, quantity: number, customerId: string): Promise<ICart> {
    return addToCart({ quantity, productId } as ICartProduct, customerId)
  }
  async removeFromCart(productIds: string[], customerId: string): Promise<ICart> {
    return removeFromCart(customerId, productIds)
  }
  async updateCart(payload: IUpdateCartProduct): Promise<ICart> {
    const { productId, oldQuantity, quantity, customerId } = payload
    if (quantity === 0) {
      return removeFromCart(customerId, [productId])
    }
    return updateCart(productId, customerId, quantity - oldQuantity)
  }

  async getCartByCustomerId(customerId: string): Promise<ICartDocument> {
    return getCartByCustomerId(customerId)
  }

  async reviewCarts(
    customerId: string,
    productDiscounts: {
      productId: string
      discountCode: string
    }[],
    address: string
  ): Promise<any> {
    const cart = await getCartByCustomerId(customerId)
    if (!cart) {
      throw new NotFound('Cart not found')
    }

    const reviewedCart = await reviewCarts(cart, productDiscounts, address)
    const redisKey = `reviewed_cart_${customerId}`
    return setCache(redisKey, reviewedCart)
  }
}

export default new CartService()
