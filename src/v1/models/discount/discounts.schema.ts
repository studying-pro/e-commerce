import mongoose, { Document, ObjectId, Schema } from 'mongoose'
import { DOCUMENT_NAME as productDocumentName } from '../product/products.schema'
import { DOCUMENT_NAME as userDocumentName } from '../account/users.schema'
const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discounts'

interface IDiscountSchema {
  name: string
  description: string
  type: string
  code: string
  startDate: Date
  endDate: Date
  usesCount: number
  appliedCount: number
  value: number
  appliesToCategories: string[]
  appliesTo: string
  productIds: mongoose.Types.ObjectId[]
  customerIds: mongoose.Types.ObjectId[]

  maxUses?: number
  maxUsesPerCustomer?: number

  isActive: boolean

  userId: mongoose.Types.ObjectId
}

interface IDiscountDocument extends IDiscountSchema, Document {}

const discountSchema = new Schema<IDiscountDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['percentage', 'fixed'] },
    code: { type: String, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usesCount: { type: Number, default: 0 },
    appliedCount: { type: Number, default: 0 },
    value: { type: Number, required: true, default: 0 },
    appliesToCategories: { type: [String] },
    appliesTo: { type: String, enum: ['all', 'specific'] },
    productIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: productDocumentName
        }
      ]
    },
    customerIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: userDocumentName
        }
      ]
    },
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: userDocumentName }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const DiscountModel = mongoose.model<IDiscountDocument>(DOCUMENT_NAME, discountSchema)

export { IDiscountSchema, IDiscountDocument, DiscountModel, DOCUMENT_NAME }
