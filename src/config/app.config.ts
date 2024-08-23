type AppConfig = {
  PORT: number
  NODE_ENV: string
}

const appConfig: AppConfig = {
  PORT: Number(process.env.PORT ?? '3000'),
  NODE_ENV: process.env.NODE_ENV ?? 'development'
}

export default appConfig
