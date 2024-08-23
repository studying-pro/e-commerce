import Joi from 'joi'

export interface ProductSchemaInput {
  name: string
  price: number
  category: string
  description?: string
  stock: number
  image?: string
  brand: string
  attributes: Record<string, unknown>
}

const createClothingSchema = Joi.object({
  color: Joi.string().required(),
  size: Joi.string().required(),
  material: Joi.string().required()
})

const createElectronicsSchema = Joi.object({
  features: Joi.array().items(Joi.string()).required(),
  color: Joi.string().required(),
  weight: Joi.number().required(),
  dimensions: Joi.object({
    height: Joi.number().required(),
    width: Joi.number().required(),
    depth: Joi.number().required()
  }).required()
})

const updateClothingSchema = Joi.object({
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  material: Joi.string().optional()
})

const updateElectronicsSchema = Joi.object({
  features: Joi.array().items(Joi.string()).optional(),
  color: Joi.string().optional(),
  weight: Joi.number().optional(),
  dimensions: Joi.object({
    height: Joi.number().optional(),
    width: Joi.number().optional(),
    depth: Joi.number().optional()
  }).optional()
})

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  description: Joi.string().optional(),
  stock: Joi.number().required(),
  image: Joi.string().optional(),
  brand: Joi.string().required(),
  attributes: Joi.object()
    .required()
    .when('category', [
      {
        is: 'clothing',
        then: createClothingSchema
      },
      {
        is: 'electronics',
        then: createElectronicsSchema
      }
    ])
})

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  category: Joi.string().optional(),
  description: Joi.string().optional(),
  stock: Joi.number().optional(),
  image: Joi.string().optional(),
  brand: Joi.string().optional(),
  attributes: Joi.object()
    .optional()
    .when('category', [
      {
        is: 'clothing',
        then: updateClothingSchema
      },
      {
        is: 'electronics',
        then: updateElectronicsSchema
      }
    ])
})

export const queryProductsSchema = Joi.object({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  search: Joi.string().optional().exist()
  // Add other query parameters as necessary
})
