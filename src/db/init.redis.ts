import Redis from 'ioredis'
import { redisConfig } from '~/config/db.config'

const { host, port, username, password, db } = redisConfig

type RedisConnection = {
  instance: Redis | null
  init: () => void
}

const redis: RedisConnection = {
  instance: null,
  init: () => {
    if (redis.instance !== null) {
      return redis.instance
    } else {
      const client = new Redis({
        host,
        port,
        password,
        db
      })

      redis.instance = client

      client.on('connect', () => console.log('Redis connected'))

      client.on('error', (err) => console.error(`Redis error: ${err}`))
      client.on('close', () => console.log('Client closed'))
    }
  }
}

export default redis
