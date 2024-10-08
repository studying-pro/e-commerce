import mongoose, { QueryOptions } from 'mongoose'
import { IProductSchema, ProductModel } from '../models/product/products.schema'
import { UserModel } from '../models/account/users.schema'
import { BadRequest, NotFound } from '~/models/Error'
import { IListResult } from '~/type'
import elasticClient from '~/config/elasticsearch.config'
import { getOrSetCache, clearCache } from '~/utils/cache.utils'

// In-memory cache for non-existent IDs
const nonExistentIdsCache = new Set<string>()

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

const getApproximateCount = async (query: IProductSchema) => {
  const stats = await ProductModel.aggregate([
    { $match: { ...query, isDeleted: false, isDraft: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
    { $project: { _id: 0, count: 1 } }
  ])
  return stats.length > 0 ? stats[0].count : 0
}

const findProducts = async (query: IProductSchema, options: QueryOptions, limit: number = 50, offset: number = 0) => {
  const cacheKey = `products:${limit}:${offset}`

  return getOrSetCache(cacheKey, async () => {
    const totalDoc = await getApproximateCount(query)
    const skip = offset * limit
    const products = await ProductModel.aggregate([
      { $match: { ...query, isDeleted: false, isDraft: false } },
      { $sort: options.sort ?? { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          user: 1,
          name: 1,
          description: 1,
          price: 1,
          stock: 1,
          category: 1,
          tags: 1,
          images: 1,
          isDraft: 1,
          isPublish: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          _id: 1
        }
      }
    ]).exec()

    return {
      data: products,
      total: totalDoc,
      totalPage: Math.ceil(totalDoc / limit),
      limit,
      offset
    }
  })
}

const findProductById = async (id: string) => {
  if (nonExistentIdsCache.has(id)) {
    throw new NotFound('Product not found')
  }

  const cacheKey = `product:${id}`

  return getOrSetCache(cacheKey, async () => {
    const product = await ProductModel.findById(id)
    if (!product) {
      nonExistentIdsCache.add(id)
      throw new NotFound('Product not found')
    }
    return product
  })
}

const searchProducts = async (search: string, query: IProductSchema, limit: number = 50, offset: number = 0) => {
  const result = await elasticClient.search({
    index: 'products',
    body: {
      from: offset,
      size: limit,
      query: {
        bool: {
          must: [
            {
              nested: {
                path: '_doc',
                query: {
                  bool: {
                    must: [
                      {
                        multi_match: {
                          query: search,
                          fields: ['_doc.name', '_doc.description', '_doc.category', '_doc.tags'],
                          fuzziness: 'AUTO',
                          operator: 'and'
                        }
                      },
                      {
                        term: {
                          '_doc.isPublish': true
                        }
                      },
                      {
                        term: {
                          '_doc.isDraft': false
                        }
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  })

  const hits = result.hits.hits
  const total = result.hits.total || 0
  const products = hits.map((hit: any) => ({
    ...hit._source._doc,
    id: hit._id
  }))

  return {
    data: products,
    total,
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

  await clearCache(`product:${id}`)
  return product
}

const publishProduct = async (id: string, userId: string) => {
  const data = await ProductModel.findOneAndUpdate(
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

  await clearCache(`product:${id}`)
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

// Add this function to check indexes
const checkIndexes = async () => {
  const indexes = await ProductModel.collection.getIndexes()
  console.log('Indexes:', indexes)
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
