import { AuthFailureError, BadRequest, ConflictError, Forbidden } from '~/models/Error'
import { UserModel } from '../models/account/users.schema'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './key-token.service'
import { createPairToken, verifyToken } from '~/auth/auth.utils'
import { getIntoData, otpGenerator } from '~/utils'
import { random } from 'lodash'
import { EXPIRY_DATE } from '../constants'
import { KeyTokenStore } from '../models/account/keys-store.schema'
import sendEmail from '~/common/email/send-grid.email'

interface IAccountResponse {
  metadata: {
    user: Partial<Object>
  }
  token: {
    accessToken: string
    refreshToken: string
  }
}

interface IAccountService {
  logout(keyStore: string): Promise<IAccountResponse>
  login(email: string, password: string): Promise<IAccountResponse>
  signUp(email: string, password: string, firstname: string, lastname: string): Promise<IAccountResponse>
  handleRefreshToken(refreshToken: string): Promise<IAccountResponse>
}

class AccountService implements IAccountService {
  constructor(private keyTokenService: KeyTokenService) {
    this.keyTokenService = keyTokenService
  }
  async logout(keyStore: string): Promise<IAccountResponse> {
    await KeyTokenStore.findByIdAndDelete(keyStore)
    return {
      metadata: {
        user: {}
      },
      token: {
        accessToken: '',
        refreshToken: ''
      }
    }
  }
  async login(email: string, password: string): Promise<IAccountResponse> {
    const user = await UserModel.findOne({ email: email })

    if (!user) {
      throw new BadRequest('This email is not registered')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      throw new AuthFailureError('Invalid password')
    }

    const privateKey: string = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10)
    const publicKey: string = await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 10)
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

    await this.keyTokenService.createKeyToken(user, privateKey, publicKey, keyPairs.refreshToken, EXPIRY_DATE)

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

  async signUp(email: string): Promise<any> {
    const isEmailExist = await UserModel.findOne({ email })

    if (isEmailExist) {
      throw new ConflictError('Email already exist')
    }

    const otp = await otpGenerator(email)

    const response = await sendEmail({
      to: email,
      data: {
        email,
        username: `user_${random(1000, 9999)}`,
        verificationLink: `${process.env.BASE_URL}/${process.env.VERIFICATION_ROUTE}?email=${email}&otp=${otp}`
      }
    })
    console.log('response', response)

    return {
      message: 'Email sent successfully',
      response
    }
  }

  async handleRefreshToken(refreshToken: string): Promise<IAccountResponse> {
    const isRefreshTokenUsed = await KeyTokenStore.findOne({
      refreshTokenUsed: {
        $in: [refreshToken]
      }
    })

    if (isRefreshTokenUsed) {
      throw new Forbidden('Something went wrong!!! Please try login again')
    }

    const holderRefreshToken = await KeyTokenStore.findOne({
      refreshToken: refreshToken
    })

    if (!holderRefreshToken) {
      throw new BadRequest('Invalid refresh token')
    }

    const now = Date.now()
    const expiryDate = new Date(holderRefreshToken.refreshTokenExpiry).getTime()

    if (now > expiryDate) {
      throw new BadRequest('Refresh token expired')
    }

    const decoded = verifyToken(refreshToken, holderRefreshToken.publicKey)
    const user = await UserModel.findOne({
      email: decoded.user.email
    })

    if (!user) {
      throw new BadRequest('User not found')
    }

    const keyPairs = createPairToken(
      {
        user: {
          id: user.id,
          email: user.email
        }
      },
      holderRefreshToken.publicKey,
      '1h'
    )

    await holderRefreshToken.updateOne({
      $set: {
        refreshToken: keyPairs.refreshToken,
        refreshTokenExpiry: EXPIRY_DATE
      },
      $addToSet: {
        refreshTokenUsed: refreshToken
      }
    })

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
}

export default new AccountService(new KeyTokenService())
