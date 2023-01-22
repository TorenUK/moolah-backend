import dotenv from 'dotenv'
import * as yup from 'yup'

dotenv.config()

const envVarsSchema = yup.object({
  PORT: yup.number().default(4444).defined(),
  SOCKET_PORT: yup.number().default(3333).defined(),
  ENV: yup.string().default('development').defined(),

  MONGO_USERNAME: yup.string().defined(),
  MONGO_DB: yup.string().defined(),
  MONGO_SERVERS: yup.string().defined(),
  MONGO_PASSWORD: yup.string().defined()
})

const envVars = envVarsSchema.validateSync(process.env)

const config = {
  port: envVars.PORT,
  socketPort: envVars.SOCKET_PORT,
  env: envVars.ENV,

  bullMq: {
    queueName: process.env.QUEUE_NAME || 'email-queue',
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '1'),
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: parseInt(process.env.REDIS_PORT || '6379')
    },
    limiter: {
      max: parseInt(process.env.MAX_LIMIT || '1'),
      duration: parseInt(process.env.DURATION_LIMIT || '1000')
    }
  },

  aws: {
    region: process.env.AWS_DEFAULT_REGION || 'eu-west-2',
    key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : void 0,
    secure: true,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS
    }
  },

  db: {
    mongo_username: envVars.MONGO_USERNAME,
    mongo_db: envVars.MONGO_DB,
    mongo_servers: envVars.MONGO_SERVERS,
    mongo_password: envVars.MONGO_PASSWORD
  },

  mail: {
    from: process.env.MAIL_ADDRESS || 'support@moolah.guru'
  }
}

export default config
