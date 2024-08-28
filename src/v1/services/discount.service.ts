import { IListResult } from '~/type'
import { IDiscountDocument, IDiscountSchema } from '../models/discount/discounts.schema'
import { QueryOptions } from 'mongoose'
import {
  createDiscount,
  deleteDiscount,
  getDiscountById,
  getDiscounts,
  updateDiscount
} from '../repositories/discount.repository'

interface IDiscountService {
  getDiscounts(query: any, options: QueryOptions, limit: number, offset: number): Promise<IListResult>
  getDiscountById(id: string): Promise<IDiscountDocument>
  createDiscount(discount: IDiscountSchema): Promise<IDiscountDocument>
  updateDiscount(id: string, discount: IDiscountSchema): Promise<IDiscountDocument>
  deleteDiscount(id: string): Promise<void>
}

class DiscountService implements IDiscountService {
  getDiscounts(query: any, options: QueryOptions, limit: number = 50, offset: number = 0): Promise<IListResult> {
    return getDiscounts(query, options, limit, offset)
  }
  getDiscountById(id: string): Promise<IDiscountDocument> {
    return getDiscountById(id)
  }
  createDiscount(discount: IDiscountSchema): Promise<IDiscountDocument> {
    return createDiscount(discount)
  }
  updateDiscount(id: string, discount: IDiscountSchema): Promise<IDiscountDocument> {
    return updateDiscount(id, discount)
  }
  deleteDiscount(id: string): Promise<void> {
    return deleteDiscount(id)
  }
}

const discountService = new DiscountService()
export { DiscountService, discountService }
