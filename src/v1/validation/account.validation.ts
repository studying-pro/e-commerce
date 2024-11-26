import Joi from 'joi'

interface SignUpInput {
  email: string
}

interface LoginInput {
  email: string
  password: string
}

interface RefreshTokenInput {
  refreshToken: string
}

const validateSignup = Joi.object({
  email: Joi.string().email().required()
})

const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

const validateRefreshToken = Joi.object({
  refreshToken: Joi.string().required()
})

export { SignUpInput, LoginInput, RefreshTokenInput, validateSignup, validateLogin, validateRefreshToken }
