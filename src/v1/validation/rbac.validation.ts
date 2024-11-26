import Joi from 'joi'

const validateCreatingRole = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})

const validateCreatingPermission = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  action: Joi.string().required(),
  attributes: Joi.string().required()
})

const validateCreatingResource = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})

const validateCreatingRBAC = Joi.object({
  role: validateCreatingRole,
  permissions: Joi.array().items(validateCreatingPermission),
  resource: validateCreatingResource
})

export { validateCreatingRole, validateCreatingPermission, validateCreatingResource, validateCreatingRBAC }
