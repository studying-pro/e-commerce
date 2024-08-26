import dbConfig from '~/config/db.config'
import mongoose, { Connection } from 'mongoose'

const { SCHEME, HOST, USER, PASSWORD, DB } = dbConfig

const uri = `${SCHEME}://${USER}:${PASSWORD}@${HOST}/${DB}`

type DBConnection = {
  instance: Connection | null
  init: () => void
}

const db: DBConnection = {
  instance: null,
  init() {
    mongoose.connect(uri, {
      authSource: DB
    })

    this.instance = mongoose.connection

    this.instance.on('open', () => {
      console.log('Database is connected')
    })

    this.instance.on('error', (err) => {
      console.error(err)
    })
  }
}

export default db
