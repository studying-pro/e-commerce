import Router from 'express'
import accountRouter from './account'
import dataRouter from './data'
import productRouter from './product'
import cartRouter from './cart'
import discountRouter from './discount'
import inventoryRouter from './iventory'
import orderRouter from './order'
import fileRouter from './file'

const router = Router()

router.use('/generate-data', dataRouter)
router.use('/account', accountRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/discounts', discountRouter)
router.use('/orders', orderRouter)
router.use('/inventories', inventoryRouter)
router.use('/files', fileRouter)
export default router
