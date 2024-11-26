import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import { json } from 'body-parser'
import db from './db/init.mongo'
import router from './v1/routes'
import { errorGloballyHandler } from './middlewares/error.handler'
import redis from './db/init.redis'
import initElasticsearch from './db/init.elasticsearch'
import limiter from './middlewares/rate.limiting'
import { loggerHandler } from './middlewares/logger.handler'
const app = express()

// Middlewares
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(compression())
app.use(json())
app.use(limiter)
app.use(loggerHandler)

// Initialize the database connection
db.init()
redis.init()

app.use('/api/v1', router)

// Handle Errors globally
app.use(errorGloballyHandler)

export default app
