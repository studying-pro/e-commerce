import { ClientSession } from 'mongoose'
import { InventoryModel, IInventoryDocument } from '../models/inventory/inventory.model'
import { NotFound } from '~/models/Error'

class InventoryService {
  async getInventory(productId: string): Promise<IInventoryDocument> {
    const inventory = await InventoryModel.findOne({ productId })
    if (!inventory) {
      throw new NotFound('Inventory not found')
    }
    return inventory
  }

  async updateInventory(productId: string, quantity: number, client?: ClientSession): Promise<IInventoryDocument> {
    const inventory = await InventoryModel.findOneAndUpdate(
      { productId },
      { $inc: { quantity } },
      { new: true, upsert: true, session: client }
    )
    return inventory
  }
}

export default new InventoryService()
