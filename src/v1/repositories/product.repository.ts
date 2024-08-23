import { PipelineStage, QueryOptions } from 'mongoose'
import { IProductSchema, ProductModel } from '../models/product/products.schema'
import { UserModel } from '../models/account/users.schema'
import { BadRequest, NotFound } from '~/models/Error'
import { IListResult } from '~/type'

const findMyProducts = async (
  id: string,
  query: IProductSchema,
  options: QueryOptions,
  limit: number = 50,
  offset: number = 0
): Promise<IListResult> => {
  const user = await UserModel.findById(id)
  if (!user) {
    throw new NotFound('User not found')
  }
  return findProducts({ ...query, userId: user.id }, options, limit, offset)
}

const findDraftProducts = async (
  query: IProductSchema,
  options: QueryOptions,
  limit: number = 50,
  offset: number = 0
) => {
  return findProducts({ ...query, isDraft: true }, options, limit, offset)
}

const findPublishedProducts = async (
  query: IProductSchema,
  options: QueryOptions,
  limit: number = 50,
  offset: number = 0
) => {
  return findProducts({ ...query, isPublish: true }, options, limit, offset)
}

const findProducts = async (query: IProductSchema, options: QueryOptions, limit: number = 50, offset: number = 0) => {
  const products = await ProductModel.find(
    {
      ...query,
      isDeleted: false
    },
    options
  )
    .limit(limit)
    .skip(offset)
    .populate('userId')
  return {
    data: products,
    total: products.length,
    limit,
    offset
  }
}

const findProductById = async (id: string) => {
  const product = await ProductModel.findById(id)
  if (!product) {
    throw new NotFound('Product not found')
  }
  return product
}

const searchProducts = async (search: string, query: IProductSchema, limit: number = 50, offset: number = 0) => {
  console.log(search)
  const agg: PipelineStage[] = [
    {
      $search: {
        index: 'default',
        text: {
          query: search,
          path: {
            wildcard: '*'
          }
        }
      }
    },
    {
      $sort: {
        score: {
          $meta: 'textScore'
        }
      }
    },
    {
      $match: {
        ...query
      }
    },
    {
      $limit: limit
    },
    {
      $skip: offset
    }
  ]

  const products = await ProductModel.aggregate(agg)
  return {
    data: products,
    total: products.length,
    limit,
    offset
  }
}

// Modify Product
const updateProduct = async (id: string, userId: string, payload: IProductSchema) => {
  const product = await ProductModel.findByIdAndUpdate(
    {
      _id: id,
      userId
    },
    payload,
    {
      new: true
    }
  ).populate('productId')

  if (!product) {
    throw new NotFound('Product not found')
  }

  return product
}
const publishProduct = async (id: string, userId: string) => {
  const data = await ProductModel.findByIdAndUpdate(
    {
      _id: id,
      userId
    },
    {
      isPublish: true,
      isDraft: false
    },
    {
      new: true
    }
  )

  if (!data) {
    throw new NotFound('Product not found')
  }

  return data
}

const unpublishProduct = async (id: string, userId: string) => {
  const data = await ProductModel.findByIdAndUpdate(
    {
      id
    },
    {
      isPublish: false,
      isDraft: true
    },
    {
      new: true
    }
  )

  if (!data) {
    throw new NotFound('Product not found')
  }

  return data
}

const deleteProduct = async (id: string, userId: string) => {
  const product = await ProductModel.findById(id)
  if (!product) {
    throw new NotFound('Product not found')
  }
  const data = await ProductModel.findByIdAndUpdate(
    {
      _id: id,
      userId,
      isDeleted: false,
      isPublish: false,
      isDraft: true
    },
    {
      isDeleted: true,
      isPublish: false,
      isDraft: false,
      deletedAt: new Date()
    },
    {
      new: true
    }
  )

  if (!data) {
    throw new BadRequest('Cannot delete product because it is published')
  }

  return data
}

const restoreProduct = async (id: string, userId: string) => {
  const product = await ProductModel.findById(id)
  if (!product) {
    throw new NotFound('Product not found')
  }
  const data = await ProductModel.findByIdAndUpdate(
    {
      _id: id,
      userId,
      isDeleted: true
    },
    {
      isDeleted: false,
      isDraft: true,
      deletedAt: null
    },
    {
      new: true
    }
  )

  if (!data) {
    throw new BadRequest('Cannot restore product')
  }

  return data
}

export {
  findMyProducts,
  findDraftProducts,
  findPublishedProducts,
  findProducts,
  findProductById,
  searchProducts,
  publishProduct,
  unpublishProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
}
