type ConfirmEmailData = {
    name: string
    email: string
    token: string
}

export type MailRequest = MailData & {
    subject: string
}

export type MailData = ConfirmEmailData

export const mapMailDataToRequest = (subject: string) => (data: MailData): MailRequest => ({
    subject,
    ...data
})

export type Mail = {
    from: string
    to: string
    subject: string
    html: string
}

export type MailType = Mail