import { object } from 'joi'
import elasticClient from '~/config/elasticsearch.config'

// Initialize Elasticsearch index
const initElasticsearch = async () => {
  try {
    // Test the connection first
    await elasticClient.ping()
    console.log('Successfully connected to Elasticsearch')

    const indexExists = await elasticClient.indices.exists({ index: 'products' })
    if (!indexExists) {
      await elasticClient.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              _doc: {
                type: 'nested'
              }
            }
          }
        }
      })
      console.log('Elasticsearch index created')
    }
  } catch (error) {
    console.error('Error initializing Elasticsearch:', error)
  }
}

export default initElasticsearch
