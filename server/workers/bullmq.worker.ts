import { QueueScheduler, Worker } from 'bullmq'
import config from '@app/config'
import transport from '@services/transport'

export const worker = new Worker(config.bullMq.queueName, transport, {
  connection: config.bullMq.connection,
  concurrency: config.bullMq.concurrency,
  limiter: config.bullMq.limiter
})

export const scheduler = new QueueScheduler(config.bullMq.queueName, {
  connection: config.bullMq.connection
})
