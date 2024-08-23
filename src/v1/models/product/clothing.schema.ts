import { Schema } from 'mongoose'
import { IProductSchema, ProductModel } from './products.schema'

// Define the Clothing document interface
const DOCUMENT_NAME: string = 'clothing'
interface IClothing extends IProductSchema {
  color: string
  size: string
  material: string
}

// Define the Clothing schema
const clothingSchema = new Schema<IClothing>({
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  }
})

// Create the Clothing model
const ClothingModel = ProductModel.discriminator<IClothing>(DOCUMENT_NAME, clothingSchema)

export { ClothingModel, IClothing }
