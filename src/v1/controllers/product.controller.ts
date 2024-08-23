import { Request, Response } from 'express'
import productService from '../services/product.service'
import { InternalServerError } from '~/models/Error'
import { CreatedResponse, OKResponse } from '~/models/Success'
import { HEADER } from '../constants'
import mongoose, { ObjectId } from 'mongoose'
import { ProductSchemaInput } from '../validation/product.validation'
import { IProductSchema } from '../models/product/products.schema'

class ProductController {
  async createProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const { attributes, ...product } = req.body as ProductSchemaInput

    const finalProduct = {
      ...product,
      ...attributes
    } as IProductSchema

    const newProduct = await productService.createProduct(product.category, {
      ...finalProduct,
      userId: new mongoose.Types.ObjectId(userId) as unknown as ObjectId
    })

    if (!newProduct) {
      throw new InternalServerError('There was an error creating the product')
    }

    return new CreatedResponse('Product created successfully', newProduct).send(res)
  }

  async getProducts(req: Request, res: Response) {
    const { limit, offset, ...query } = req.query
    const products = await productService.findProducts(
      {
        ...query,
        isPublish: true
      },
      {},
      Number(limit),
      Number(offset)
    )

    return new OKResponse('Get products successfully', products).send(res)
  }
  async myProducts(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const { limit, offset, ...query } = req.query
    const products = await productService.findMyProducts(userId, query, {}, Number(limit), Number(offset))

    return new OKResponse('Get my products successfully', products).send(res)
  }

  async getDraftProducts(req: Request, res: Response) {
    // Get all draft products
  }

  async getPublishedProducts(req: Request, res: Response) {
    // Get all published products
  }

  async searchProduct(req: Request, res: Response) {
    const { search, limit, offset } = req.query
    const newLimit = limit && Number(limit) > 0 ? Number(limit) : 50
    const newOffset = offset && Number(offset) > 0 ? Number(offset) : 0
    const products = await productService.searchProduct(
      search as string,
      {
        isPublish: true
      } as IProductSchema,
      newLimit,
      newOffset
    )

    return new OKResponse('Search product successfully', products).send(res)
  }

  async publishProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const productId = req.params.id
    const product = await productService.publishProduct(productId, userId)

    return new OKResponse('Product published successfully', product).send(res)
  }

  async unpublishProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const productId = req.params.id
    const product = await productService.unpublishProduct(productId, userId)

    return new OKResponse('Product unpublished successfully', product).send(res)
  }

  async getProduct(req: Request, res: Response) {
    const productId = req.params.id
    const product = await productService.getProduct(productId)

    return new OKResponse('Get product successfully', product).send(res)
  }

  async updateProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const productId = req.params.id
    const { attributes, ...product } = req.body as ProductSchemaInput

    const finalProduct = {
      ...product,
      ...attributes
    } as IProductSchema

    const updatedProduct = await productService.updateProduct(productId, userId, finalProduct)

    return new OKResponse('Product updated successfully', updatedProduct).send(res)
  }

  async deleteProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const productId = req.params.id
    await productService.deleteProduct(productId, userId)

    return new OKResponse('Product deleted successfully').send(res)
  }

  async restoreProduct(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const productId = req.params.id
    const product = await productService.restoreProduct(productId, userId)

    return new OKResponse('Product restored successfully', product).send(res)
  }
}

export default new ProductController()
