import { Router } from 'express'
import { authenticationHandler } from '~/middlewares/auth.handler'
import { asyncHandler } from '~/middlewares/error.handler'
import { validate, validateQuery } from '~/middlewares/validate'
import productController from '~/v1/controllers/product.controller'
import { createProductSchema, queryProductsSchema, updateProductSchema } from '~/v1/validation/product.validation'

const productRouter = Router()

productRouter.get('/', asyncHandler(productController.getProducts))
productRouter.get('/search', validateQuery(queryProductsSchema), asyncHandler(productController.searchProduct))
productRouter.get('/:id', asyncHandler(productController.getProduct))
productRouter.use(asyncHandler(authenticationHandler))

productRouter.post('/', validate(createProductSchema), asyncHandler(productController.createProduct))
productRouter.patch('/:id', validate(updateProductSchema), asyncHandler(productController.updateProduct))
productRouter.delete('/:id', asyncHandler(productController.deleteProduct))
productRouter.post('/:id/restore', asyncHandler(productController.restoreProduct))

productRouter.get('/me', validateQuery(queryProductsSchema), asyncHandler(productController.myProducts))
productRouter.get('/me/drafts', asyncHandler(productController.getDraftProducts))
productRouter.put('/me/:id/publish', asyncHandler(productController.publishProduct))
productRouter.put('/me/:id/unpublish', asyncHandler(productController.unpublishProduct))
export default productRouter
