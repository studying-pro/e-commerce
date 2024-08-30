import { InternalServerError } from '~/models/Error'
import { IProductDocument, IProductSchema, ProductModel } from '../models/product/products.schema'
import { Electronics, IElectronics } from '../models/product/electionics.schema'
import { ClothingModel, IClothing } from '../models/product/clothing.schema'
import { ObjectId, QueryOptions } from 'mongoose'
import {
  deleteProduct,
  findMyProducts,
  findProductById,
  findProducts,
  publishProduct,
  restoreProduct,
  searchProducts,
  unpublishProduct,
  updateProduct
} from '../repositories/product.repository'
import { IListResult } from '~/type'

interface IProductService {
  createProduct(type: string, payload: IProductSchema): Promise<IProductDocument>
  searchProduct(search: string, query: IProductSchema, limit: number, offset: number): Promise<IListResult>
  findMyProducts(id: string, query: any, options: QueryOptions, limit: number, offset: number): Promise<IListResult>
  publishProduct(id: string, userId: string): Promise<IProductDocument>
  unpublishProduct(id: string, userId: string): Promise<IProductDocument>
  updateProduct(id: string, userId: string, payload: IProductSchema): Promise<IProductDocument>
  deleteProduct(id: string, userId: string): Promise<IProductDocument>
  restoreProduct(id: string, userId: string): Promise<IProductDocument>
}

class ProductFactory implements IProductService {
  static readonly productRegistry: Map<string, typeof Product> = new Map<string, typeof Product>()

  static registerProduct(name: string, product: typeof Product): void {
    if (this.productRegistry.has(name)) {
      throw new InternalServerError('Product already exists')
    }
    this.productRegistry.set(name, product)
  }

  async createProduct(type: string, payload: IProductSchema) {
    const product = ProductFactory.productRegistry.get(type)
    if (!product) {
      throw new InternalServerError('Product not found')
    }
    return new product(payload).save()
  }
  async findMyProducts(
    id: string,
    query: any,
    options: QueryOptions,
    limit: number = 50,
    offset: number = 0
  ): Promise<IListResult> {
    return findMyProducts(id, query, options, limit, offset)
  }

  async findProducts(query: any, options: QueryOptions, limit: number, offset: number) {
    return findProducts(query, options, limit, offset)
  }

  async publishProduct(id: string, userId: string): Promise<IProductDocument> {
    return publishProduct(id, userId)
  }
  async unpublishProduct(id: string, userId: string): Promise<IProductDocument> {
    return unpublishProduct(id, userId)
  }
  async searchProduct(search: string, query: IProductSchema, limit: number, offset: number): Promise<IListResult> {
    console.log('search', search)
    const result = await searchProducts(search, query, limit, offset)
    return {
      data: result.data,
      total: typeof result.total === 'number' ? result.total : result.total.value,
      limit: result.limit,
      offset: result.offset
    }
  }

  async getProduct(id: string): Promise<IProductDocument> {
    return findProductById(id)
  }

  async updateProduct(id: string, userId: string, payload: IProductSchema): Promise<IProductDocument> {
    return updateProduct(id, userId, payload)
  }

  async deleteProduct(id: string, userId: string): Promise<IProductDocument> {
    return deleteProduct(id, userId)
  }

  async restoreProduct(id: string, userId: string): Promise<IProductDocument> {
    return restoreProduct(id, userId)
  }
}

class Product implements IProductSchema {
  name: string
  price: number
  brand: string
  description: string
  sold: number
  stock: number
  image: string
  category: string
  userId: ObjectId

  constructor(product: IProductSchema) {
    this.name = product.name
    this.brand = product.brand
    this.price = product.price
    this.description = product.description
    this.stock = product.stock
    this.sold = product.sold
    this.image = product.image
    this.category = product.category
    this.userId = product.userId
  }

  async save(): Promise<IProductDocument> {
    // Save the product to the database
    const newProduct = new ProductModel(this)
    return newProduct.save()
  }
}

class Electronic extends Product implements IElectronics {
  features: string[]
  color: string
  weight: number
  dimensions: { height: number; width: number; depth: number }

  constructor(product: IElectronics) {
    super(product)
    this.features = product.features
    this.color = product.color
    this.weight = product.weight
    this.dimensions = product.dimensions
  }

  async save(): Promise<IProductDocument> {
    // Save the product to the database
    return await Electronics.create(this)
  }
}

class Clothing extends Product implements IClothing {
  color: string
  size: string
  material: string

  constructor(product: IClothing) {
    super(product)
    this.color = product.color
    this.size = product.size
    this.material = product.material
  }

  async save(): Promise<IProductDocument> {
    // Save the product to the database
    return (await ClothingModel.create(this)).save()
  }
}

ProductFactory.registerProduct('electronics', Electronic)
ProductFactory.registerProduct('clothing', Clothing)

export default new ProductFactory()
