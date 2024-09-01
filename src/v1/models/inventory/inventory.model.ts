import mongoose, { Schema, Document, ObjectId } from 'mongoose'

interface IInventory {
  productId: ObjectId
  quantity: number
}

interface IInventoryDocument extends IInventory, Document {}

const inventorySchema = new Schema<IInventoryDocument>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true, default: 0 }
  },
  { timestamps: true, collection: 'inventories' }
)

const InventoryModel = mongoose.model<IInventoryDocument>('inventory', inventorySchema)

export { IInventory, IInventoryDocument, InventoryModel }
