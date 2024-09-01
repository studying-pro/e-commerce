import { OrderModel, IOrderDocument } from '../models/order/order.model'
import { NotFound } from '~/models/Error'

const createOrder = async (orderData: Partial<IOrderDocument>): Promise<IOrderDocument> => {
  const order = new OrderModel(orderData)
  return order.save()
}

const getOrderById = async (orderId: string): Promise<IOrderDocument> => {
  const order = await OrderModel.findById(orderId)
  if (!order) {
    throw new NotFound('Order not found')
  }
  return order
}

const getOrdersByCustomerId = async (customerId: string): Promise<IOrderDocument[]> => {
  return OrderModel.find({ customerId })
}

export { createOrder, getOrderById, getOrdersByCustomerId }
