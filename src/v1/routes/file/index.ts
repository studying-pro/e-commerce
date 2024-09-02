import { Router } from 'express'
import { asyncHandler } from '~/middlewares/error.handler'
import upload from '~/utils/file.util'
import fileController from '~/v1/controllers/file.controller'

const fileRouter = Router()

fileRouter.post('/upload-image', upload.single('image'), asyncHandler(fileController.uploadImage))
fileRouter.post(
  '/upload-multiple-images',
  upload.array('images', Number.parseInt(process.env.MULTER_MAX_FILES as string)),
  asyncHandler(fileController.uploadMultipleImages)
)

fileRouter.post('/upload-image-to-s3', upload.single('image'), asyncHandler(fileController.uploadImageToS3))
fileRouter.post(
  '/upload-multiple-images-to-s3',
  upload.array('images', Number.parseInt(process.env.MULTER_MAX_FILES as string)),
  asyncHandler(fileController.uploadMultipleImagesToS3)
)

export default fileRouter
