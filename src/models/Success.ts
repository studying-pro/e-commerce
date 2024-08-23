import { Response } from 'express'
import { StatusCode } from '~/constant/http-status'
import { ReasonPhrases } from '~/constant/message'

class Success {
  private code: number
  private message: string
  private data: any

  constructor(message: string, data: any, code: number) {
    this.message = message
    this.data = data
    this.code = code
  }

  get getCode(): number {
    return this.code
  }

  get getMessage(): string {
    return this.message
  }

  get getData(): any {
    return this.data
  }

  send(res: Response, headers = {}) {
    return res.status(this.code).json({
      success: true,
      message: this.getMessage,
      data: this.getData,
      code: this.getCode
    })
  }
}

class CreatedResponse extends Success {
  constructor(message: string = ReasonPhrases.CREATED, data: any = {}) {
    super(message, data, StatusCode.CREATED)
  }
}

class OKResponse extends Success {
  constructor(message: string = ReasonPhrases.OK, data: any = {}) {
    super(message, data, StatusCode.OK)
  }
}

class NoContentResponse extends Success {
  constructor(message: string = ReasonPhrases.NO_CONTENT, data: any = {}) {
    super(message, data, StatusCode.NO_CONTENT)
  }
}

export { Success, CreatedResponse, OKResponse, NoContentResponse }
