import Router from 'express'
import accountRouter from './account'
import productRouter from './product'
import cartRouter from './cart'
import discountRouter from './discount'
import inventoryRouter from './iventory'
import orderRouter from './order'

const router = Router()

router.use('/account', accountRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/discounts', discountRouter)
router.use('/orders', orderRouter)
router.use('/inventories', inventoryRouter)
export default router
