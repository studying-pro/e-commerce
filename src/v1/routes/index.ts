import Router from 'express'
import accountRouter from './account'
import dataRouter from './data'
import productRouter from './product'
import cartRouter from './cart'
import discountRouter from './discount'

const router = Router()

router.use('/generate-data', dataRouter)
router.use('/account', accountRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/discounts', discountRouter)
export default router
