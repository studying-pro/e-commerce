import path from 'path'
import YAML from 'yamljs'

const permissionRoleURL = path.join(__dirname, 'permission-role-management.schema.yaml')
const accountManagementURL = path.join(__dirname, 'account-management.schema.yaml')
const productManagementURL = path.join(__dirname, 'product-management.schema.yaml')
const permissionRoleSchemaResponse = YAML.load(permissionRoleURL)
const accountManagementSchema = YAML.load(accountManagementURL)
const productManagementSchema = YAML.load(productManagementURL)
const schemas = {
  request: {
    ...accountManagementSchema.Request,
    ...productManagementSchema.Request
  },
  response: {
    ...permissionRoleSchemaResponse,
    ...accountManagementSchema.Response,
    ...productManagementSchema.Response
  }
}

export default schemas
