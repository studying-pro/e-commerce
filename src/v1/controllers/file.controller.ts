import { Request, Response } from 'express'
import { BadRequest } from '~/models/Error'
import { OKResponse } from '~/models/Success'
import cloudinaryService from '~/v1/services/cloudinary.service'
import { HEADER } from '../constants'
import s3Service from '../services/s3.service'

class FileController {
  async uploadImage(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const file = req.file
    if (!file) {
      throw new BadRequest('No file uploaded')
    }
    const result = await cloudinaryService.uploadImage(file, userId)
    return new OKResponse('Upload image successfully', result).send(res)
  }

  async uploadMultipleImages(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const files = req.files
    if (!files) {
      throw new BadRequest('No files uploaded')
    }
    const result = await cloudinaryService.uploadMultipleImages(files as Express.Multer.File[], userId)
    return new OKResponse('Upload multiple images successfully', result).send(res)
  }

  async uploadImageToS3(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const file = req.file
    if (!file) {
      throw new BadRequest('No file uploaded')
    }
    const result = await s3Service.uploadImageToS3(file, userId)
    return new OKResponse('Upload image to S3 successfully', result).send(res)
  }

  async uploadMultipleImagesToS3(req: Request, res: Response) {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    const files = req.files
    if (!files) {
      throw new BadRequest('No files uploaded')
    }
    const result = await s3Service.uploadMultipleImagesToS3(files as Express.Multer.File[], userId)
    return new OKResponse('Upload multiple images to S3 successfully', result).send(res)
  }
}

export default new FileController()
