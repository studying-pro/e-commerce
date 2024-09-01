import mongoose, { Schema, Document, ObjectId } from 'mongoose'

interface IOrderProduct {
  productId: ObjectId
  quantity: number
  price: number
  name: string
}

interface IOrder {
  customerId: ObjectId
  products: IOrderProduct[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  address: string
}

interface IOrderDocument extends IOrder, Document {}

const orderSchema = new Schema<IOrderDocument>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true }
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    address: { type: String, required: true }
  },
  { timestamps: true, collection: 'orders' }
)

const OrderModel = mongoose.model<IOrderDocument>('order', orderSchema)

export { IOrder, IOrderDocument, OrderModel }
