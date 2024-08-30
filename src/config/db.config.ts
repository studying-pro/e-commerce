type DbConfig = {
  SCHEME: string
  HOST: string
  USER: string
  PASSWORD: string
  DB: string
}

const dbConfig: DbConfig = {
  SCHEME:
    process.env.NODE_ENV !== 'production' ? (process.env.DB_SCHEME_DEV ?? '') : (process.env.DB_SCHEME_PROD ?? ''),
  HOST: process.env.NODE_ENV !== 'production' ? (process.env.DB_HOST_DEV ?? '') : (process.env.DB_HOST_PROD ?? ''),
  USER: process.env.NODE_ENV !== 'production' ? (process.env.DB_USER_DEV ?? '') : (process.env.DB_USER_PROD ?? ''),
  PASSWORD: process.env.NODE_ENV !== 'production' ? (process.env.DB_PASS_DEV ?? '') : (process.env.DB_PASS_PROD ?? ''),
  DB: process.env.NODE_ENV !== 'production' ? (process.env.DB_DATABASE_DEV ?? '') : (process.env.DB_DATABASE_PROD ?? '')
}

const redisConfig = {
  host: process.env.REDIS_DEV_HOST ?? 'localhost',
  port: Number(process.env.REDIS_DEV_PORT ?? 6379),
  username: process.env.REDIS_DEV_USERNAME ?? '',
  password: process.env.REDIS_DEV_PASSWORD ?? '',
  db: Number(process.env.REDIS_DEV_DB ?? 0)
}

export { dbConfig, redisConfig }
