import 'dotenv/config'
import app from '~/app'
import { setupSwagger } from '~/helper/swagger'

const portEnv = Number(process.env.PORT ?? '3000')
const PORT: number = portEnv

setupSwagger(app)

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close()
  console.log('Server is stopped')
})
