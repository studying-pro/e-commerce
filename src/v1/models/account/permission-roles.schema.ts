import mongoose, { Schema, Document, model, ObjectId } from 'mongoose'
// Define the interface for the permission role document
interface IPermissionRole {
  role: ObjectId
  permissions: ObjectId
}

interface IPermissionRoleDocument extends IPermissionRole, Document {}

const DOCUMENT_NAME = 'permission-role'
const COLLECTION_NAME = 'permission-roles'
// Define the schema for the permission role
const permissionRoleSchema = new Schema<IPermissionRoleDocument>(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'role'
    },
    permissions: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'permission'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

// Create and export the permission role model
const PermissionRole = model<IPermissionRoleDocument>(DOCUMENT_NAME, permissionRoleSchema)

export { IPermissionRole, PermissionRole, DOCUMENT_NAME }
