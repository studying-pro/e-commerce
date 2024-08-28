import mongoose, { ObjectId, Schema } from 'mongoose'
import { DOCUMENT_NAME as documentProductName } from '../product/products.schema'
import { DOCUMENT_NAME as documentUserName } from '../account/users.schema'

interface IUpdateCartProduct {
  productId: string
  oldQuantity: number
  quantity: number
  customerId: string
  version: number
}
interface ICartProduct {
  productId: mongoose.Types.ObjectId
  quantity: number
  price: number
  name: string
  userId: string
}

interface ICart {
  state: 'active' | 'completed' | 'cancelled'
  count: number
  products: ICartProduct[]
  customerId: ObjectId
}

interface ICartDocument extends ICart, Document {}

const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema<ICartDocument>(
  {
    state: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    count: { type: Number, default: 0 },
    products: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: documentProductName, required: true },
          quantity: { type: Number, required: true, default: 1 },
          price: { type: Number, required: true },
          name: { type: String, required: true },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: documentUserName, required: true }
        }
      ],
      required: true,
      default: []
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: documentUserName, required: true }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const CartModel = mongoose.model<ICartDocument>(DOCUMENT_NAME, cartSchema)

export { ICartDocument, ICartProduct, ICart, CartModel, DOCUMENT_NAME, IUpdateCartProduct }
