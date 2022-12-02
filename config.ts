import dotenv from 'dotenv'
import * as yup from 'yup'

dotenv.config()

const envVarsSchema = yup.object({
  PORT: yup.number().default(4444).defined(),
  ENV: yup.string().default('development').defined(),

  MONGO_USERNAME: yup.string().defined(),
  MONGO_DB: yup.string().defined(),
  MONGO_SERVERS: yup.string().defined(),
  MONGO_PASSWORD: yup.string().defined(),
})

const envVars = envVarsSchema.validateSync(process.env)

const config = {
  port: envVars.PORT,
  env: envVars.ENV,

  db: {
    mongo_username: envVars.MONGO_USERNAME,
    mongo_db: envVars.MONGO_DB,
    mongo_servers: envVars.MONGO_SERVERS,
    mongo_password: envVars.MONGO_PASSWORD
  }

}

export default config
