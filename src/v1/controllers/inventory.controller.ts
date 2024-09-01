import { Request, Response } from 'express'
import { OKResponse } from '~/models/Success'
import { BadRequest } from '~/models/Error'
import inventoryService from '../services/inventory.service'

class InventoryController {
  async getInventory(req: Request, res: Response) {
    const { productId } = req.params
    if (!productId) {
      throw new BadRequest('Product ID is required')
    }
    const inventory = await inventoryService.getInventory(productId)
    return new OKResponse('Inventory retrieved successfully', inventory).send(res)
  }

  async updateInventory(req: Request, res: Response) {
    const { productId } = req.params
    const { quantity } = req.body
    if (!productId || quantity === undefined) {
      throw new BadRequest('Product ID and quantity are required')
    }
    const inventory = await inventoryService.updateInventory(productId, quantity)
    return new OKResponse('Inventory updated successfully', inventory).send(res)
  }
}

export default new InventoryController()
