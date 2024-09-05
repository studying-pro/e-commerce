import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

interface ILogging {
  level: string
  message: string
  timestamp: string
  requestId: string
  context: string
  method: string
  router: string
  meta: any
}
const { combine, timestamp, printf } = format

// Custom log format to include requestId, context, and metadata
const customFormat = printf(({ timestamp, level, message, requestId, context, router, method, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${requestId ? `[requestId: ${requestId}]` : ''} [${context || 'default'}] at ${router || 'default'} ${method || 'default'} ${method === 'GET' ? 'query: ' : 'body: '} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
})

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss Z'
    }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
})

const logInfo = (data: ILogging) => {
  logger.info(data)
}

const logError = (data: ILogging) => {
  logger.error(data)
}

export { logInfo, logError, logger, ILogging }
