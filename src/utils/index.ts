import _, { random } from 'lodash'
import redisClient from '../db/init.redis'
import { setCache } from './cache.utils'
import { IUser } from '~/v1/models/account/users.schema'
export const getIntoData = (object: Object, fields: string[]) => {
  return _.pick(object, fields)
}

export const otpGenerator = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  // TODO: Save OTP to Redis with 2 minutes expiration
  console.log(`otp:${email}`, otp)
  return setCache(`otp:${email}`, otp, 120)
}

export const userInformationGenerator = () => {
  const firstName = `firstname_${random(1000, 9999)}`
  const lastName = `lastname_${random(1000, 9999)}`
  const password = `password_${random(1000, 9999)}`
  return {
    firstname: firstName,
    lastname: lastName,
    password
  }
}
