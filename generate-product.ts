import fs from 'fs'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface IProductBase {
  name: string
  price: number
  brand: string
  description: string
  stock: number
  sold: number
  image: string
  category: string
  tags: string[]
  rating: number
  topSeller: boolean
  userId: ObjectId
  slug: string
  isDraft: boolean
  isPublish: boolean
  isDeleted: boolean
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  type: string
}

interface IElectronics extends IProductBase {
  features: string[]
  color: string
  weight: number
  dimensions: {
    height: number
    width: number
    depth: number
  }
}

interface IClothing extends IProductBase {
  color: string
  size: string
  material: string
}

type Product = IElectronics | IClothing

function generateProduct(): Product {
  const productType = Math.random() < 0.5 ? 'electronic' : 'clothing'
  const baseProduct: IProductBase = {
    name: `Product ${Math.floor(Math.random() * 1000000)}`,
    price: Number((Math.random() * 990 + 10).toFixed(2)),
    brand: `Brand ${Math.floor(Math.random() * 100)}`,
    description: `Description for product ${Math.floor(Math.random() * 1000000)}`,
    stock: Math.floor(Math.random() * 1001),
    sold: Math.floor(Math.random() * 501),
    image: `https://example.com/image${Math.floor(Math.random() * 1000)}.jpg`,
    category: ['Electronics', 'Clothing', 'Home', 'Sports'][Math.floor(Math.random() * 4)],
    tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => `tag${i + 1}`),
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    topSeller: Math.random() < 0.5,
    userId: new ObjectId(),
    slug: `product-${Math.floor(Math.random() * 1000000)}`,
    isDraft: Math.random() < 0.5,
    isPublish: Math.random() < 0.5,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(),
    type: productType
  }

  if (productType === 'electronic') {
    return {
      ...baseProduct,
      features: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => `Feature ${i + 1}`),
      color: ['Black', 'White', 'Silver', 'Gold'][Math.floor(Math.random() * 4)],
      weight: Number((Math.random() * 9.9 + 0.1).toFixed(2)),
      dimensions: {
        height: Number((Math.random() * 99 + 1).toFixed(2)),
        width: Number((Math.random() * 99 + 1).toFixed(2)),
        depth: Number((Math.random() * 99 + 1).toFixed(2))
      }
    }
  } else {
    return {
      ...baseProduct,
      color: ['Red', 'Blue', 'Green', 'Black', 'White'][Math.floor(Math.random() * 5)],
      size: ['XS', 'S', 'M', 'L', 'XL'][Math.floor(Math.random() * 5)],
      material: ['Cotton', 'Polyester', 'Wool', 'Silk'][Math.floor(Math.random() * 4)]
    }
  }
}

async function generateProductsFile(filename: string, numProducts: number, batchSize: number = 1000): Promise<void> {
  const writeStream = fs.createWriteStream(filename)
  writeStream.write('[\n')

  for (let i = 0; i < numProducts; i += batchSize) {
    const batch = Array.from({ length: Math.min(batchSize, numProducts - i) }, generateProduct)
    writeStream.write(JSON.stringify(batch).slice(1, -1))
    if (i + batchSize < numProducts) {
      writeStream.write(',\n')
    } else {
      writeStream.write('\n')
    }
  }

  writeStream.write(']\n')
  writeStream.end()

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })
}

// Generate 10 million products
generateProductsFile('products.json', 100000)
  .then(() => console.log('Product generation complete'))
  .catch((error) => console.error('Error generating products:', error))

export { generateProductsFile }
