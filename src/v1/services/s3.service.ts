import { PutObjectCommand } from '@aws-sdk/client-s3'
import s3Client from '../../config/s3.config'

const uploadImageToS3 = async (file: Express.Multer.File, userId: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: `${userId}/${file.originalname}`,
    Body: file.buffer
  })

  const response = await s3Client.send(command)
  return response
}

const uploadMultipleImagesToS3 = async (files: Express.Multer.File[], userId: string) => {
  return await Promise.all(files.map((file) => uploadImageToS3(file, userId)))
}

export default {
  uploadImageToS3,
  uploadMultipleImagesToS3
}
