import Joi from 'joi'

const AddProductToCartValidate = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required()
})

const UpdateCartValidate = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  oldQuantity: Joi.number().min(1).required(),
  version: Joi.number().min(1).required()
})

const ReviewCartRequestValidate = Joi.object({
  productDiscounts: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        discountCode: Joi.string().optional()
      })
    )
    .required()
})

export { AddProductToCartValidate, UpdateCartValidate, ReviewCartRequestValidate }
