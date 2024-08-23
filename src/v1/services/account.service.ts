import { AuthFailureError, BadRequest, ConflictError, Forbidden } from '~/models/Error'
import { UserModel } from '../models/account/users.schema'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './key-token.service'
import { createPairToken, verifyToken } from '~/auth/auth.utils'
import { getIntoData } from '~/utils'
import { RoleModel } from '../models/account/roles.schema'
import { random } from 'lodash'
import { EXPIRY_DATE } from '../constants'
import { KeyTokenStore } from '../models/account/keys-store.schema'

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

  async signUp(email: string, password: string, firstname: string, lastname: string): Promise<IAccountResponse> {
    const isEmailExist = await UserModel.findOne({ email })

    if (isEmailExist) {
      throw new ConflictError('Email already exist')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new UserModel({
      email,
      userName: `${firstname}_${lastname}_${random(1000, 9999)}`,
      role: await RoleModel.findOne({ name: 'Seller' }),
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
