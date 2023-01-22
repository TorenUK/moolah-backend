import { MailType } from '@domain/mail'
import config from '@app/config'
import { Queue } from 'bullmq'
import { toUnexpectedError } from '@domain/Error'

const generateEmailVerificationHTML =
  (name: string) => async (verificationCode: string) =>
    `
  <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #fafafa;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #eeeeee;
        padding: 20px;
      }
      h1 {
        font-size: 24px;
        color: #444444;
        margin-bottom: 20px;
      }
      a {
        color: #0088cc;
        text-decoration: none;
        width: 100%
        padding-bottom: 10px;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Hi ${name},</p>
      <p>
        Thank you for signing up to Moolah Guru. Please verify your email
        address by clicking the button below:
      </p>
      <p>
        <a http://host.docker.internal:5555/verifyEmail?code=${verificationCode}">
          Verify Email
        </a>
      </p>
      <p>Best regards,<br />The Team at Moolah Guru</p>
    </div>
  </body>
</html>
  `

// offload the email sending process to a queue
// if server is down the email will be sent when the server is back up

const queue = new Queue<MailType>(config.bullMq.queueName, {
  connection: config.bullMq.connection
})

export const sendVerificationEmail = async (mail: Omit<MailType, 'html'>) => {
  try {
    const html = await generateEmailVerificationHTML(mail.name)(
      mail.verificationCode
    )

    const resp = await queue.add('send', {
      ...mail,
      html
    })
    console.log(resp)
  } catch (err) {
    console.log(err)
    throw toUnexpectedError(err)
  }
}
