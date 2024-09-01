import redis from '~/db/init.redis'

const DEFAULT_EXPIRATION = 3600 // 1 hour in seconds

export async function getOrSetCache(key: string, cb: () => Promise<any>, expiration = DEFAULT_EXPIRATION) {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  const cachedData = await instance.json.get(key)
  if (cachedData !== null) {
    return cachedData
  }

  const freshData = await cb()
  await instance.json.set(key, '$', freshData)
  await instance.expire(key, expiration)
  return freshData
}

export async function setCache(key: string, value: any, expiration = DEFAULT_EXPIRATION) {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  const cachedData = await instance.json.get(key)
  if (cachedData !== null) {
    return cachedData
  }

  await instance.json.set(key, '$', value)
  await instance.expire(key, expiration)
  return value
}

export async function clearCache(key: string) {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  await instance.del(key)
}

export async function getJSONCache(key: string): Promise<any> {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  const cachedData = await instance.json.get(key)
  return cachedData
}
