// export type MailRequest = MailData & {
//   subject: string
// }

// export type MailData = ConfirmEmail

// export const mapMailDataToRequest =
//   (subject: string) =>
//   (data: MailData): MailRequest => ({
//     subject,
//     ...data
//   })

export type GeneralMail = {
  from: string
  to: string
  subject: string
  html: string
}

type ConfirmEmail = GeneralMail & {
  name: string
  email: string
  verificationCode: string
}

export type MailType = ConfirmEmail
