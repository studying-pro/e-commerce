import { Request, Response } from 'express'
import { DiscountService } from '../services/discount.service'
import { OKResponse } from '~/models/Success'
import { IDiscountSchema } from '../models/discount/discounts.schema'
import { HEADER } from '../constants'
import mongoose from 'mongoose'

class DiscountController {
  constructor(private readonly discountService: DiscountService) {
    this.discountService = discountService

    // Bind methods to the class instance
    this.deleteDiscount = this.deleteDiscount.bind(this)
    this.getAllDiscounts = this.getAllDiscounts.bind(this)
    this.getDiscountById = this.getDiscountById.bind(this)
    this.createDiscount = this.createDiscount.bind(this)
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
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const discount = req.body as IDiscountSchema
    const newDiscount = await this.discountService.createDiscount({
      ...discount,
      userId: new mongoose.Types.ObjectId(userId)
    })
    return new OKResponse('Create discount successfully', newDiscount).send(res)
  }
}

export default new DiscountController(new DiscountService())
