import { IKeyTokenStoreDocument, KeyTokenStore } from '../models/account/keys-store.schema'
import { IUser, IUserDocument } from '../models/account/users.schema'

interface IKeyTokenStore {
  createKeyToken(
    user: IUser,
    privateKey: string,
    publicKey: string,
    refreshToken: string,
    expiryDate: Date
  ): Promise<IKeyTokenStoreDocument>
}

class KeyTokenService implements IKeyTokenStore {
  createKeyToken(
    user: IUserDocument,
    privateKey: string,
    publicKey: string,
    refreshToken: string,
    expiryDate: Date
  ): Promise<IKeyTokenStoreDocument> {
    return KeyTokenStore.findOneAndUpdate(
      {
        userId: user.id,
        email: user.email
      },
      {
        $set: {
          userId: user.id,
          email: user.email,
          publicKey,
          privateKey,
          refreshToken,
          refreshTokenExpiry: expiryDate
        }
      },
      {
        new: true,
        upsert: true
      }
    ).exec()
  }
}

export default KeyTokenService
