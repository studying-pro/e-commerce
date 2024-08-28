import { NotFound } from '~/models/Error'
import { ICart, ICartProduct, IUpdateCartProduct } from '../models/cart/carts.model'
import {
  addToCart,
  createCart,
  getCartByCustomerId,
  removeFromCart,
  reviewCarts,
  updateCart
} from '../repositories/cart.repository'
import mongoose from 'mongoose'

interface ICartService {
  createCart(customerId: string): Promise<ICart>
  addToCart(productId: string, quantity: number, customerId: string, name: string, price: number): Promise<ICart>
  removeFromCart(productId: string[], customerId: string): Promise<ICart>
  updateCart(payload: IUpdateCartProduct): Promise<ICart>
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
    const newProductId = new mongoose.Types.ObjectId(productId)
    return addToCart({ quantity, productId: newProductId } as ICartProduct, customerId)
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

  async reviewCarts(
    customerId: string,
    productDiscounts: {
      productId: string
      discountCode: string
    }[],
    address: string
  ): Promise<any> {
    // Implement logic to review and apply discounts
    const cart = await getCartByCustomerId(customerId)
    if (!cart) {
      throw new NotFound('Cart not found')
    }
    return reviewCarts(cart, productDiscounts, address)
  }
}

export default new CartService()
