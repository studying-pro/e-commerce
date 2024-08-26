import Joi from 'joi'

interface SignUpInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface LoginInput {
  email: string
  password: string
}

interface RefreshTokenInput {
  refreshToken: string
}

const validateSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required()
})

const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

const validateRefreshToken = Joi.object({
  refreshToken: Joi.string().required()
})

export { SignUpInput, LoginInput, RefreshTokenInput, validateSignup, validateLogin, validateRefreshToken }
