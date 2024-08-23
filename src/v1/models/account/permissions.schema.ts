import { Schema, Document, model, ObjectId } from 'mongoose'
import { DOCUMENT_NAME as documentRoleName } from './permission-roles.schema'
// Define the permissions document interface
interface IPermissions {
  description: string
  path: string
  method: string
  roles: ObjectId[]
}

// Define the permissions document
interface IPermissionsDocument extends IPermissions, Document {}

const DOCUMENT_NAME: string = 'permission'
const COLLECTION_NAME: string = 'permissions'

// Define the permissions schema
const permissionsSchema = new Schema<IPermissionsDocument>(
  {
    description: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: documentRoleName
        }
      ]
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

// Create the permissions model
const Permissions = model<IPermissionsDocument>(DOCUMENT_NAME, permissionsSchema)

export { DOCUMENT_NAME, IPermissionsDocument, Permissions, IPermissions }
