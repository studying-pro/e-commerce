import { NextFunction, Request, Response } from 'express'
import { NotFound, Unauthorized } from '~/models/Error'
import { HEADER } from '~/v1/constants'
import { KeyTokenStore } from '~/v1/models/account/keys-store.schema'
import { UserModel } from '~/v1/models/account/users.schema'
import { verifyToken } from '~/auth/auth.utils'
import { TokenExpiredError } from 'jsonwebtoken'

export const authenticationHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  const auth = req.headers[HEADER.AUTHORIZATION] as string
  if (!userId) {
    throw new Unauthorized('Authentication failed')
  }

  if (!auth) {
    throw new Unauthorized('Authentication failed')
  }

  const keyStore = await KeyTokenStore.findOne({ userId })

  if (!keyStore) {
    throw new NotFound('User not found')
  }

  try {
    const decoded = verifyToken(auth, keyStore.publicKey)
    if (!decoded) {
      throw new Unauthorized('Authentication failed')
    }

    const user = await UserModel.findById(decoded.user.id)
    if (!user) {
      throw new NotFound('User not found')
    }
    req.headers[HEADER.KEY_STORE_ID] = keyStore.id
    next()
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new Unauthorized('Token expired')
    }

    throw err
  }
}
