import mongoose, { Schema, model, Document, ObjectId } from 'mongoose'
import { DOCUMENT_NAME as userDocument } from '../account/users.schema'
import slugify from 'slugify'
import elasticClient from '~/config/elasticsearch.config'

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

// Define the base product schema
interface IProductSchema {
  name: string
  price: number
  brand: string
  description: string
  stock: number
  sold: number
  image: string
  category: string
  tags?: string[]
  rating?: number
  topSeller?: boolean
  userId: ObjectId
  slug?: string

  // Define the status
  isDraft?: boolean
  isPublish?: boolean
  isDeleted?: boolean
  deletedAt?: Date
}

interface IProductDocument extends IProductSchema, Document {}

// Define the product schema
const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    sold: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    rating: { type: Number, required: true, default: 0 },
    topSeller: { type: Boolean, required: true, default: false },

    slug: { type: String },

    isDraft: { type: Boolean, default: true },
    isPublish: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userDocument
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    discriminatorKey: 'type'
  }
)

// Add text index
productSchema.index({ name: 'text', description: 'text' })

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Add Elasticsearch indexing hooks
productSchema.post('save', function (doc: IProductDocument) {
  elasticClient.index({
    index: 'products',
    id: doc.id.toString(),
    body: {
      _doc: doc
    }
  })
})

productSchema.post('findOneAndUpdate', function (doc: IProductDocument) {
  console.log('Updating Elasticsearch document:', doc.id)
  const { _id, ...partialDoc } = doc
  elasticClient.update({
    index: 'products',
    id: doc.id.toString(),
    body: {
      doc: partialDoc
    }
  })
})

productSchema.post('findOneAndDelete', function (doc: IProductDocument) {
  if (doc) {
    elasticClient.delete({
      index: 'products',
      id: doc.id.toString()
    })
  }
})

// Create the product model
const ProductModel = model<IProductDocument>(DOCUMENT_NAME, productSchema)

export { ProductModel, IProductDocument, IProductSchema, DOCUMENT_NAME }
