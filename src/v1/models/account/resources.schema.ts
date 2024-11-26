import { Document, model, Schema } from 'mongoose'

interface IResource {
  name: string
  description: string
}

interface IResourceDocument extends IResource, Document {}

const DOCUMENT_NAME = 'resource'
const COLLECTION_NAME = 'resources'

const resourceSchema: Schema<IResourceDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const ResourceModel = model<IResourceDocument>(DOCUMENT_NAME, resourceSchema)

export { IResource, IResourceDocument, resourceSchema, DOCUMENT_NAME, ResourceModel }
