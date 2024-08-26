import path from 'path'
import YAML from 'yamljs'

const permissionRoleURL = path.join(__dirname, 'permission-role-management.schema.yaml')
const accountManagementURL = path.join(__dirname, 'account-management.schema.yaml')
const permissionRoleSchemaResponse = YAML.load(permissionRoleURL)
const accountManagementSchema = YAML.load(accountManagementURL)
const schemas = {
  request: {
    ...accountManagementSchema.Request
  },
  response: {
    ...permissionRoleSchemaResponse,
    ...accountManagementSchema.Response
  }
}

export default schemas
