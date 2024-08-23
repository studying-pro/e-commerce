import Router from 'express'
import accountRouter from './account'
import dataRouter from './data'
import productRouter from './product'

const router = Router()

router.use('/generate-data', dataRouter)
router.use('/account', accountRouter)
router.use('/products', productRouter)
export default router
