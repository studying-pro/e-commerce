import { Router } from 'express'
import inventoryController from '~/v1/controllers/inventory.controller'

const inventoryRouter = Router()

inventoryRouter.get('/:productId', inventoryController.getInventory)
inventoryRouter.put('/:productId', inventoryController.updateInventory)

export default inventoryRouter
