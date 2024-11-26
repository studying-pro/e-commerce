import { BadRequest, InternalServerError, NotFound } from '~/models/Error'
import { UserModel } from '../models/account/users.schema'
import { CartModel, ICartDocument, ICartProduct } from '../models/cart/carts.model'
import { IProductDocument, ProductModel } from '../models/product/products.schema'
import { checkAndApplyDiscount } from './discount.repository'
import mongoose from 'mongoose'

const createCart = async (customerId: string): Promise<ICartDocument> => {
  // Implement logic to create a new cart document
  const user = await UserModel.findById(customerId)

  if (!user) {
    throw new NotFound('User not found')
  }

  const cart = new CartModel({ customerId: customerId })

  return await cart.save()
}

const updateQuantityForProductsInCart = async (
  cartId: string,
  product: IProductDocument,
  quantity: number
): Promise<ICartDocument> => {
  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    {
      $inc: {
        'products.$[p].quantity': quantity
      }
    },
    {
      new: true,
      arrayFilters: [{ 'p.productId': product.id }]
    }
  )

  if (!cart) {
    throw new NotFound('Cart not found')
  }

  return cart
}

const addToCart = async (payload: ICartProduct, customerId: string): Promise<ICartDocument> => {
  const user = await UserModel.findById(customerId)

  const product = await ProductModel.findById(payload.productId)
  if (!user) {
    throw new NotFound('User not found')
  }

  if (!product) {
    throw new NotFound('Product not found')
  }

  const cart = await CartModel.findOne({ customerId: customerId })

  if (!cart) {
    const newCart = new CartModel({ customerId: customerId })

    await newCart.save()

    const response = await CartModel.findOneAndUpdate(
      {
        _id: newCart.id
      },
      {
        $push: {
          products: {
            productId: product.id,
            quantity: payload.quantity,
            price: product.price,
            discountId: null
          }
        },
        $inc: { count: 1 }
      },
      { new: true, upsert: true }
    )

    if (!response) {
      throw new InternalServerError('Failed to add product to cart')
    }

    return response
  }

  if (cart.products.some((product) => product.productId.toString() === payload.productId)) {
    return updateQuantityForProductsInCart(cart.id, product, payload.quantity)
  }

  return CartModel.findOneAndUpdate(
    { 
      customerId
    },
    {
      $push: {
        products: {
          ...payload,
          price: product.price,
          name: product.name
        }
      },
      $inc: { count: 1 }
    },
    { new: true, upsert: true }
  )
}

const updateCart = async (productId: string, customerId: string, quantity: number): Promise<ICartDocument> => {
  const product = await ProductModel.findById(productId)
  const cart = await CartModel.findOne({
    customerId
  })

  if (!product) {
    throw new NotFound('Product not found')
  }

  if (!cart) {
    throw new NotFound('Cart not found')
  }

  return updateQuantityForProductsInCart(cart.id, product, quantity)
}

const removeFromCart = async (customerId: string, productIds: string[]): Promise<ICartDocument> => {
  const cart = await CartModel.findOneAndUpdate(
    {
      customerId
    },
    {
      $pull: { products: { productId: { $in: productIds } } },
      $inc: { count: -1 }
    },
    { new: true }
  )

  if (!cart) {
    throw new NotFound('Cart not found')
  }

  return cart
}

const getCartByCustomerId = async (customerId: string): Promise<ICartDocument> => {
  const cart = await CartModel.findOne({ customerId })

  if (!cart) {
    throw new NotFound('Cart not found')
  }

  return cart
}

const reviewCarts = async (
  cart: ICartDocument,
  productWithDiscounts: { productId: string; discountCode: string }[],
  address: string
): Promise<any> => {
  const products = await ProductModel.find({
    _id: {
      $in: productWithDiscounts.map((product) => new mongoose.Types.ObjectId(product.productId))
    }
  })

  if (!products.length) {
    throw new NotFound('One or more products not found')
  }

  const checkProductsInCart = cart.products.every((cartProduct) => {
    return products.some((product) => {
      return product.id.toString() === cartProduct.productId.toString()
    })
  })

  if (!checkProductsInCart) {
    throw new BadRequest('One or more products not found in the cart')
  }

  const results = cart.products.map((product) => {
    const subtotal = product.price * product.quantity
    return {
      product: product,
      subtotal
    }
  })

  const feeShipping = 42000

  const appliedDiscounts = productWithDiscounts.map(async (item) => {
    const quantity = cart.products.find((product) => product.productId.toString() === item.productId)?.quantity ?? 0
    const product = products.find((product) => product.id === item.productId)
    const finalResult = await checkAndApplyDiscount(item.discountCode, product, quantity, cart.customerId)
    return {
      ...item,
      discountId: finalResult.discountId,
      priceAfterDiscount: finalResult.finalPrice
    }
  })

  const discountsApplied = await Promise.all(appliedDiscounts)

  const total = results.reduce((acc, curr) => acc + curr.subtotal, 0)
  const totalAfterDiscount = discountsApplied.reduce((acc, curr) => acc + curr.priceAfterDiscount, 0) + feeShipping
  return {
    products: results,
    total,
    feeShipping,
    finalPrice: totalAfterDiscount,
    address
  }
}

export {
  createCart,
  addToCart,
  removeFromCart,
  updateQuantityForProductsInCart,
  updateCart,
  getCartByCustomerId,
  reviewCarts
}
