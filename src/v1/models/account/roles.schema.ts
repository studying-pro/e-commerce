import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_NAME as permissionDocumentName } from './permissions.schema'
interface IRole {
  name: string
  description: string
  status: boolean
  permissions: mongoose.Types.ObjectId[]
}

interface IRoleDocument extends IRole, Document {}

const DOCUMENT_NAME = 'role'
const COLLECTION_NAME = 'roles'
const roleSchema: Schema<IRoleDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'user',
      description: 'Role name',
      enum: ['user', 'admin', 'shop']
    },
    description: { type: String },
    status: { type: Boolean, default: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: permissionDocumentName }]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const RoleModel = mongoose.model<IRoleDocument>(DOCUMENT_NAME, roleSchema)

export { IRole, IRoleDocument, RoleModel, DOCUMENT_NAME }
