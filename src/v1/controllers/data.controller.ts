import { Response, Request } from 'express'
import { OKResponse } from '~/models/Success'
import generateData from '~/utils/generate-data'

class DataController {
  async generateData(req: Request, res: Response) {
    const data = await generateData()
    return new OKResponse('Data generated successfully', data).send(res)
  }
}

export default new DataController()
