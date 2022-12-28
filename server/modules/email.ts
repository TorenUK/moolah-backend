import nodeMailer from 'nodemailer'
import { createClient } from 'redis'
import * as AWS from 'aws-sdk'

const redisClient = createClient()

export interface EmailData {
    from: string
    to: string
    subject: string
    html: string
}

export const sendVerificationEmail = async (emailData: EmailData) => {
     redisClient.lPush('emailQueue', JSON.stringify(emailData))
}

redisClient.on('message', (_, message) => {

    const emailData: EmailData = JSON.parse(message)

    const transport = nodeMailer.createTransport({
        SES: new AWS.SES({
            apiVersion: '2010-12-01',
        })
    })

    transport.sendMail(emailData, (err, _) => {
        if (err) {
            console.log(err)
        }
    })

})

redisClient.subscribe('emailQueue', (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Subscribed to emailQueue')
})