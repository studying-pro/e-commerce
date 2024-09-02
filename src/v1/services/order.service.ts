import { OrderModel, IOrderDocument } from '../models/order/order.model'
import { BadRequest, NotFound } from '~/models/Error'
import { queueOrderRequest } from '~/utils/redisQueue'
import inventoryService from './inventory.service'
import { getJSONCache } from '~/utils/cache.utils'
import { ClientSession } from 'mongoose'

class OrderService {
  async createOrder(
    customerId: string,
    address: string,
    client?: ClientSession
  ): Promise<{ order: IOrderDocument; reviewedCart: any }> {
    const cart = await getJSONCache(`reviewed_cart_${customerId}`)
    const finalPrice = cart.finalPrice

    const products = cart.products.map((item: any) => {
      return {
        productId: item.product.productId,
        quantity: item.product.quantity,
        price: item.product.price,
        name: item.product.name,
        _id: item.product._id
      }
    })

    const order = new OrderModel({
      customerId,
      products: products,
      total: finalPrice,
      address
    })

    await order.save({ session: client })

    const reviewedCart = {
      products,
      total: finalPrice
    }

    return { order, reviewedCart }
  }

  async getOrderById(orderId: string): Promise<IOrderDocument> {
    const order = await OrderModel.findById(orderId)
    if (!order) {
      throw new NotFound('Order not found')
    }
    return order
  }

  async getOrdersByCustomerId(customerId: string): Promise<IOrderDocument[]> {
    return OrderModel.find({ customerId })
  }

  async processOrder(orderId: string, reviewedCart: any, client?: ClientSession) {
    await this.startOrderTransaction(reviewedCart, orderId, client)
  }

  private async startOrderTransaction(cart: any, orderId: string, client?: ClientSession) {
    await queueOrderRequest(orderId, async () => {
      const detuctInventory = cart.products.map(async (product: any) => {
        const inventory = await inventoryService.getInventory(product.productId)
        if (inventory.quantity < product.quantity) {
          throw new BadRequest(`Product ${product.productId} is out of stock`)
        }
        return inventoryService.updateInventory(product.productId, -product.quantity, client)
      })

      await Promise.all(detuctInventory)
    })
  }
}

export default new OrderService()
