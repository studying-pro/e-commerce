import { Document, Schema } from 'mongoose'
import { IProductSchema, ProductModel } from './products.schema'

interface IElectronics extends IProductSchema {
  features: string[]
  color: string
  weight: number
  dimensions: {
    height: number
    width: number
    depth: number
  }
}

interface ElectronicsDocument extends IElectronics, Document {}

const DOCUMENT_NAME = 'electronic'

const electronicsSchema = new Schema<ElectronicsDocument>(
  {
    features: {
      type: [String],
      required: true
    },
    color: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    dimensions: {
      height: { type: Number, required: true },
      width: { type: Number, required: true },
      depth: { type: Number, required: true }
    }
  },
  {
    timestamps: true,
    discriminatorKey: 'type'
  }
)

const Electronics = ProductModel.discriminator<ElectronicsDocument>(DOCUMENT_NAME, electronicsSchema)

export { Electronics, IElectronics }
