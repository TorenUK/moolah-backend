import mongoose, {ConnectOptions} from 'mongoose'

type MongoConfig = {
  mongo_username: string
  mongo_password: string
  mongo_db: string
  mongo_servers: string
} // todo authdb?

let mongoUri: string,
  mongoOptions: ConnectOptions = {}

const notConfigured = () => {}

let connect = notConfigured,
  disconnect = notConfigured

const configure = (config: MongoConfig): void => {
  connect = () =>
    mongoose.connect(mongoUri, mongoOptions, (error) => {
      if (error) {
        console.log('failed to connect to mongodb', {error})
      }
    })

  disconnect = () => mongoose.disconnect()

  // connect to mongodb
  let credentials = ''

  if (config.mongo_username) {
    credentials += config.mongo_username
  }
  if (config.mongo_password) {
    credentials += `:${config.mongo_password}`
  }
  if (credentials.length) {
    credentials += '@'
  }

  mongoUri = `mongodb://mongodb:27017/moolahDB`

  mongoose.connection.on('error', (error) =>
    console.log('unable to connect to mongodb', {error})
  )

  connect()
}

export default configure
