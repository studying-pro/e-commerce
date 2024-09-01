import { createClient, RedisClientType, RedisDefaultModules } from 'redis'
import { redisConfig } from '~/config/db.config'

const { host, port, username, password, db } = redisConfig

type RedisConnection = {
  instance: RedisClientType<RedisDefaultModules> | null
  init: () => void
}
const redis: RedisConnection = {
  instance: null,
  init: () => {
    if (redis.instance) {
      return redis.instance
    } else {
      const client = createClient({
        url: `redis://${host}:${port}/${db}`
      })

      client.connect()

      redis.instance = client as RedisClientType<RedisDefaultModules>

      client.on('connect', () => console.log('Redis connected'))

      client.on('error', (err) => console.error(`Redis error: ${err}`))
      client.on('close', () => console.log('Client closed'))
    }
  }
}

export default redis
