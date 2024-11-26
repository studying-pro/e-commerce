import path from 'path'
import YAML from 'yamljs'

const accountManagementURL = path.join(__dirname, 'account-management.schema.yaml')
const productManagementURL = path.join(__dirname, 'product-management.schema.yaml')
const accountManagementSchema = YAML.load(accountManagementURL)
const productManagementSchema = YAML.load(productManagementURL)
const schemas = {
  request: {
    ...accountManagementSchema.Request,
    ...productManagementSchema.Request
  },
  response: {
    ...accountManagementSchema.Response,
    ...productManagementSchema.Response
  }
}

export default schemas
