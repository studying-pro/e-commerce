type SuccessResponse = {
  success: boolean
  data: any
  message: string
  code: number
}

type ErrorResponse = {
  success: boolean
  message: string
  code: number
}

type SchemaExport = {
  name: string
  schema: any
}

type IListResult = {
  data: any
  total: number
  limit: number
  offset: number
}

type CustomResponse = SuccessResponse | ErrorResponse

export { CustomResponse, SchemaExport, IListResult }
