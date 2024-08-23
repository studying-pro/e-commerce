import mongoose, { Schema, Document, model, ObjectId } from 'mongoose'
import { DOCUMENT_NAME as permissionDocumentName } from './permission-roles.schema'
interface IRole {
  name: string
  permissions: ObjectId[]
}

interface RoleDocument extends IRole, Document {}

const DOCUMENT_NAME = 'role'
const COLLECTION_NAME = 'roles'

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: permissionDocumentName
        }
      ]
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const RoleModel = model<RoleDocument>(DOCUMENT_NAME, roleSchema)

export { IRole, RoleModel, DOCUMENT_NAME }
