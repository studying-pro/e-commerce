import { BadRequest, ConflictError } from '~/models/Error'
import { getJSONCache } from '~/utils/cache.utils'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/account/users.schema'
import { getIntoData, userInformationGenerator } from '~/utils'

import crypto from 'crypto'
import { random } from 'lodash'
import { createPairToken } from '~/auth/auth.utils'
import { EXPIRY_DATE } from '../constants'
import KeyTokenService from './key-token.service'

const verifyOtp = async (email: string, token: string) => {
  const otp = await getJSONCache(`otp_${email}`)
  if (!otp) {
    throw new BadRequest('OTP is expired for this email or not found')
  }

  if (otp !== token) {
    throw new BadRequest('OTP is not correct')
  }

  const salt = await bcrypt.genSalt(10)
  const { firstname, lastname, password } = userInformationGenerator()
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = new UserModel({
    email,
    userName: `${firstname}_${lastname}_${random(1000, 9999)}`,
    password: hashedPassword,
    firstName: firstname,
    lastName: lastname
  })

  await user.save()

  if (!user) {
    throw new ConflictError('Failed to create user')
  }

  const privateKey: string = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), salt)
  const publicKey: string = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), salt)
  const keyPairs = createPairToken(
    {
      user: {
        id: user.id,
        email: user.email
      }
    },
    publicKey,
    '1h'
  )

  await new KeyTokenService().createKeyToken(user, privateKey, publicKey, keyPairs.refreshToken, EXPIRY_DATE)

  return {
    metadata: {
      user: getIntoData(user, ['id', 'email'])
    },
    token: {
      accessToken: keyPairs.accessToken,
      refreshToken: keyPairs.refreshToken
    }
  }
}

export { verifyOtp }
