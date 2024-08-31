import redis from '~/db/init.redis'

const DEFAULT_EXPIRATION = 3600 // 1 hour in seconds

export async function getOrSetCache(key: string, cb: () => Promise<any>, expiration = DEFAULT_EXPIRATION) {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  const cachedData = await instance.call('JSON.GET', key)
  if (cachedData !== null) {
    console.log(cachedData)
    return JSON.parse(cachedData as string)
  }

  const freshData = await cb()
  await instance.call('JSON.SET', key, '$', JSON.stringify(freshData))
  await instance.call('EXPIRE', key, expiration)
  return freshData
}

export async function clearCache(key: string) {
  const instance = redis.instance
  if (!instance) {
    throw new Error('Redis instance not initialized')
  }

  await instance.call('JSON.DEL', key)
}
