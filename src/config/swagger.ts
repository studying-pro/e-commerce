import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import YAML from 'yamljs'
import schemas from '~/v1/docs/components/schema'
import paths from '~/v1/docs/paths'
import { middleware } from 'express-openapi-validator'

const swaggerSpec = YAML.load('./src/v1/docs/swagger.yaml')
const schemaRequest = schemas.request
const schemaResponse = schemas.response
const pathDocs = paths

const newSwaggerSpec = {
  ...swaggerSpec,
  components: {
    schemas: { ...swaggerSpec.components.schemas, ...schemaRequest, ...schemaResponse }
  },
  paths: { ...swaggerSpec.paths, ...pathDocs }
}

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(newSwaggerSpec))
  // Add OpenAPI validator middleware
  app.use(
    middleware({
      apiSpec: newSwaggerSpec,
      validateRequests: true,
      validateResponses: true
    })
  )
}
