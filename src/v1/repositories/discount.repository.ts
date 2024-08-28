import { ObjectId, QueryOptions } from 'mongoose'
import { DiscountModel, IDiscountSchema } from '../models/discount/discounts.schema'
import { ConflictError, InternalServerError, NotFound } from '~/models/Error'
import { IProductDocument } from '../models/product/products.schema'

const getDiscounts = async (query: IDiscountSchema, options: QueryOptions, limit: number = 50, offset = 0) => {
  return {
    total: await DiscountModel.countDocuments(query),
    data: await DiscountModel.find(query).populate('userId').skip(offset).limit(limit).exec(),
    limit,
    offset
  }
}

const getDiscountById = async (id: string) => {
  const discount = await DiscountModel.findById(id).populate('userId')
  if (!discount) {
    throw new NotFound('Discount not found')
  }

  return discount
}

const createDiscount = async (discount: IDiscountSchema) => {
  const isDiscountCodeExist = await checkDiscountCode(discount.code)
  if (isDiscountCodeExist) {
    throw new ConflictError('Discount code already exists')
  }

  const newDiscount = await DiscountModel.create(discount)

  if (!newDiscount) {
    throw new InternalServerError('Failed to create discount')
  }

  return newDiscount.save()
}

const updateDiscount = async (id: string, discount: IDiscountSchema) => {
  try {
    const isDiscountCodeExist = await checkDiscountCode(discount.code)
    if (isDiscountCodeExist) {
      throw new ConflictError('Discount code already exists')
    }

    const newDiscount = await DiscountModel.findByIdAndUpdate(id, discount, { new: true }).populate('userId')

    if (!newDiscount) {
      throw new NotFound('Discount not found')
    }

    return newDiscount
  } catch (err: any) {
    if (err instanceof NotFound) {
      throw new NotFound('Discount not found')
    }

    throw err
  }
}

const deleteDiscount = async (id: string) => {
  await DiscountModel.findByIdAndUpdate(id, { isDeleted: true })
}

const checkDiscountCode = async (code: string) => {
  const discount = await DiscountModel.findOne({ code })
  return !!discount
}

const checkAndApplyDiscount = async (
  code: string | undefined,
  product: IProductDocument | undefined,
  quantity: number,
  customerId: ObjectId
) => {
  if (!product) {
    throw new NotFound('Product not found')
  }

  if (!code || code === '') {
    return { finalPrice: product.price * quantity, discountId: null }
  }
  const discount = await DiscountModel.findOne({ isActive: true, code: code })

  if (!discount) {
    throw new NotFound('Discount not found')
  }

  if (discount.startDate && discount.startDate > new Date()) {
    throw new ConflictError('Discount is not active yet')
  }

  if (discount.appliesTo === 'specific' && !discount.productIds.includes(product.id)) {
    throw new ConflictError('Discount not applicable to this product')
  }

  if (discount.maxUses && discount.appliedCount >= discount.maxUses) {
    throw new ConflictError('Discount has reached its maximum usage limit')
  }

  const totalPrice = product.price * quantity
  const finalPrice = discount.type === 'percentage' ? (discount.value / 100) * totalPrice : totalPrice - discount.value
  console.log(finalPrice)
  return {
    finalPrice,
    discountId: discount.id
  }
}

export { getDiscounts, getDiscountById, createDiscount, updateDiscount, deleteDiscount, checkAndApplyDiscount }
