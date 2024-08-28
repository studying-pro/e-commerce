import Joi from 'joi'

const createDiscountRequestValidate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  type: Joi.string().valid('percentage', 'fixed').required(),
  code: Joi.string().required(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required(),
  value: Joi.number().when('type', [
    { is: 'percentage', then: Joi.number().min(0).max(100).required() },
    { is: 'fixed', then: Joi.number().min(0).required() }
  ]),
  appliesTo: Joi.string().valid('all', 'specific').required(),
  appliesToCategories: Joi.array().items(Joi.string()).optional(),
  productIds: Joi.array()
    .items(Joi.string())
    .when('appliesTo', {
      is: 'specific',
      then: Joi.array().items(Joi.string()).min(1).rule({
        message: "Products must be provided when 'appliesTo' is 'specific'"
      }),
      otherwise: Joi.array().items(Joi.string()).optional()
    })
})

export default createDiscountRequestValidate
