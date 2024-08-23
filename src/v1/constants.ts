const HEADER = {
  CLIENT_ID: 'x-client-id',
  API_KEY: 'x-api-key',
  REFRESH_TOKEN: 'x-client-refresh-token',
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  KEY_STORE_ID: 'key-store-id'
}

const EXPIRY_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export { HEADER, EXPIRY_DATE }
