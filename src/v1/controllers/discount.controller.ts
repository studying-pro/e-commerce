import { Request, Response } from 'express'
import { DiscountService } from '../services/discount.service'
import { OKResponse } from '~/models/Success'
import { IDiscountSchema } from '../models/discount/discounts.schema'

class DiscountController {
  constructor(private readonly discountService: DiscountService) {
    this.discountService = discountService
  }
  async deleteDiscount(req: Request, res: Response) {
    const { id } = req.params
    await this.discountService.deleteDiscount(id)
    return new OKResponse('Discount deleted successfully', null).send(res)
  }

  async getAllDiscounts(req: Request, res: Response) {
    const { limit, offset, ...query } = req.query
    const discounts = await this.discountService.getDiscounts(query, {}, Number(limit), Number(offset))
    return new OKResponse('Get all discounts successfully', discounts).send(res)
  }

  async getDiscountById(req: Request, res: Response) {
    const { id } = req.params
    const discount = await this.discountService.getDiscountById(id)
    return new OKResponse('Get discount by id successfully', discount).send(res)
  }

  async createDiscount(req: Request, res: Response) {
    const discount = req.body as IDiscountSchema
    const newDiscount = await this.discountService.createDiscount(discount)
    return new OKResponse('Create discount successfully', newDiscount).send(res)
  }
}
