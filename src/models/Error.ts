import { StatusCode } from '~/constant/http-status'
import { ReasonPhrases } from '~/constant/message'

const StatusCodeWithMessage = {
  [StatusCode.BAD_REQUEST]: ReasonPhrases.BAD_REQUEST,
  [StatusCode.UNAUTHORIZED]: ReasonPhrases.UNAUTHORIZED,
  [StatusCode.FORBIDDEN]: ReasonPhrases.FORBIDDEN,
  [StatusCode.NOT_FOUND]: ReasonPhrases.NOT_FOUND,
  [StatusCode.INTERNAL_SERVER_ERROR]: ReasonPhrases.INTERNAL_SERVER_ERROR
}

class CustomError extends Error {
  code: number
  message: string
  success: boolean = false

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
  }
}

class ConflictError extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.CONFLICT]) {
    super(StatusCode.CONFLICT, message)
  }
}

class BadRequest extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.BAD_REQUEST]) {
    super(StatusCode.BAD_REQUEST, message)
  }
}

class AuthFailureError extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.UNAUTHORIZED]) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

class Unauthorized extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.UNAUTHORIZED]) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

class Forbidden extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.FORBIDDEN]) {
    super(StatusCode.FORBIDDEN, message)
  }
}

class NotFound extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.NOT_FOUND]) {
    super(StatusCode.NOT_FOUND, message)
  }
}

class InternalServerError extends CustomError {
  constructor(message: string = StatusCodeWithMessage[StatusCode.INTERNAL_SERVER_ERROR]) {
    super(StatusCode.INTERNAL_SERVER_ERROR, message)
  }
}

export {
  CustomError,
  ConflictError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
  AuthFailureError
}
