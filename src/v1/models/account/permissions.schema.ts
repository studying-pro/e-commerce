import mongoose, { Document, Schema } from 'mongoose'
import { DOCUMENT_NAME as ResourceDocumentName } from './resources.schema'

const DOCUMENT_NAME = 'permission'
const COLLECTION_NAME = 'permissions'

// Define the Permission schema for managing user roles and permissions.
interface IPermission {
  resource: mongoose.Types.ObjectId | undefined
  action: string
  attributes: string
  description: string
  status: boolean
}

interface IPermissionDocument extends IPermission, Document {}

const permissionSchema: Schema<IPermissionDocument> = new mongoose.Schema(
  {
    resource: { type: mongoose.Schema.Types.ObjectId, ref: ResourceDocumentName, required: true },
    action: { type: String, required: true },
    attributes: { type: String },
    description: { type: String },
    status: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const PermissionModel = mongoose.model<IPermissionDocument>(DOCUMENT_NAME, permissionSchema)

export { IPermission, IPermissionDocument, PermissionModel, DOCUMENT_NAME }
