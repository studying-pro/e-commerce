import { v2 as cloudinary } from 'cloudinary'
import cloudinaryConfig from '~/config/cloudinary.config'
import { Readable } from 'stream'

cloudinary.config(cloudinaryConfig)

const uploadImage = async (file: Express.Multer.File, userId: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `shop_dev/${userId}`,
        public_id: file.originalname.split('.')[0] // Use the file name without extension as public_id
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve({
          image: result?.secure_url,
          thumbnail: result?.secure_url
            ? cloudinary.url(result.public_id, {
                width: 150,
                height: 150,
                format: 'jpg'
              })
            : null
        })
      }
    )

    // Convert buffer to readable stream and pipe it to the upload stream
    const bufferStream = new Readable()
    bufferStream.push(file.buffer)
    bufferStream.push(null)
    bufferStream.pipe(uploadStream)
  })
}

const uploadMultipleImages = async (files: Express.Multer.File[], userId: string) => {
  return await Promise.all(files.map((file) => uploadImage(file, userId)))
}

export default {
  uploadImage,
  uploadMultipleImages
}
