import {GeneralMail} from '@domain/mail'
import { Job } from 'bullmq'
import {SES} from 'aws-sdk'
import nodemailer from 'nodemailer'
import config from '@app/config'

const transporter = nodemailer.createTransport({
    SES: new SES({
        apiVersion: '2010-12-01',
        region: config.aws.region,
        accessKeyId: config.aws.key,
        secretAccessKey: config.aws.secret_key
    })
})

export default (job: Job<GeneralMail>) => transporter.sendMail(job.data)