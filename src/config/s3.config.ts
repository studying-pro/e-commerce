import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string
  },
  region: process.env.AWS_S3_REGION as string
})

export default s3Client
