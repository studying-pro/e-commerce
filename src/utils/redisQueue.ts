import redis from '~/db/init.redis'

export async function queueOrderRequest(orderId: string, processOrder: () => Promise<void>) {
  const lockKey = `order_lock:${orderId}`
  const lock = await redis.instance?.set(lockKey, 'locked', { EX: 30, NX: true }) // 30 seconds lock

  if (!lock) {
    throw new Error('Order is already being processed')
  }

  try {
    await processOrder()
  } finally {
    await redis.instance?.del(lockKey)
  }
}
