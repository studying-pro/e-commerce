import 'dotenv/config'
import app from '~/app'

const portEnv = Number(process.env.PORT ?? '3000')
const PORT: number = portEnv

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close()
  console.log('Server is stopped')
})
