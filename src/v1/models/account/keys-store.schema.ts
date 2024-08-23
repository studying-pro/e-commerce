import mongoose, { ObjectId, Schema, model } from 'mongoose'
import { DOCUMENT_NAME as userDocumentName } from './users.schema'

interface IKeyTokenStore {
  userId: ObjectId
  email: string
  publicKey: string
  privateKey: string
  refreshToken: string
  refreshTokenExpiry: Date
  refreshTokenUsed: [string]
}

interface IKeyTokenStoreDocument extends IKeyTokenStore, Document {}

const DOCUMENT_NAME = 'key-token-store'
const COLLECTION_NAME = 'key-token-stores'
const keyTokenStoreSchema = new Schema<IKeyTokenStoreDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: userDocumentName
    },
    email: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String
    },
    refreshTokenExpiry: {
      type: Date
    },
    refreshTokenUsed: {
      type: [String]
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const KeyTokenStore = model<IKeyTokenStoreDocument>(DOCUMENT_NAME, keyTokenStoreSchema)

export { KeyTokenStore, IKeyTokenStoreDocument, IKeyTokenStore, DOCUMENT_NAME }
