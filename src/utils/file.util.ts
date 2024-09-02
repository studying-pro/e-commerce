import multer from 'multer'

const storage =
  process.env.MULTER_STORAGE_ENGINE === 'disk'
    ? multer.diskStorage({
        destination: (_, __, cb) => {
          cb(null, process.env.MULTER_DEST as string)
        },
        filename: (_, __, cb) => {
          const fileName = crypto.getRandomValues(new Uint32Array(10)).join('')
          cb(null, `${process.env.MULTER_FILE_NAME_PREFIX}${fileName}${process.env.MULTER_FILE_NAME_SUFFIX}`)
        }
      })
    : multer.memoryStorage()

const upload = multer({ storage })

export default upload
