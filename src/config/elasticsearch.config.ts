import { Client } from '@elastic/elasticsearch'

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  // Remove log and apiVersion, add tls option for more secure connections
  tls: { rejectUnauthorized: false },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || ''
  }
})

export default elasticClient
