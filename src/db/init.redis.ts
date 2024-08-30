import { createClient } from 'redis'
import { redisConfig } from '~/config/db.config'

const { host, port, username, password, db } = redisConfig

type RedisConnection = {
  instance: any | null
  init: () => void
}

const generateUri = () => {
  return username && password
    ? `redis://${username}:${password}@${host}:${port}/${db}`
    : `redis://${host}:${port}/${db}`
}

const redis: RedisConnection = {
  instance: null,
  init: () => {
    if (redis.instance !== null) {
      return redis.instance
    } else {
      const client = createClient({
        url: generateUri()
      })
      client.connect().then(() => {
        redis.instance = client
      })
      client.on('error', (err) => console.error(`Redis error: ${err}`))
      client.on('close', () => console.log('Client closed'))
    }
  }
}

export default redis
