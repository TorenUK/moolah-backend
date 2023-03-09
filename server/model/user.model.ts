import {
  getModelForClass,
  modelOptions,
  Prop,
  Severity,
  pre,
  DocumentType,
  ReturnModelType
} from '@typegoose/typegoose'
import { nanoid } from 'nanoid'
import argon2 from 'argon2'
import { Account } from '@model/account.model'
import { sendVerificationEmail } from '@services/mail.service'
import config from '@app/config'

type Notification = {
  id: string
  type: string
  isRead: boolean
  message: string
  createdAt: Date
}

class Notifications {
  @Prop({ default: [], required: true })
  notifications: Notification[]
}
class EmailConfig {
  @Prop({ default: false, required: true })
  isEmailVerified: boolean

  @Prop({ default: () => nanoid(), unique: true })
  verificationCode: string

  @Prop({ default: () => new Date(Date.now() + 600000), required: true })
  expiration: Date
}

// pre-save hook to hash passwords
@pre<User>('save', async function () {
  if (!this.isModified('password')) return

  const hash = await argon2.hash(this.password)

  this.password = hash

  return
})
// pre-save hook to send email verification code
@pre<User>('save', async function () {
  if (this.emailConfig.isEmailVerified) return

  sendVerificationEmail({
    name: this.firstName,
    email: this.email,
    verificationCode: this.emailConfig.verificationCode,
    from: config.mail.from,
    to: this.email,
    subject: 'Verify your email'
  })

  return
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @Prop({ lowercase: true, required: true, unique: true })
  email: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({ required: true })
  password: string

  @Prop()
  passwordResetCode: string | null

  @Prop({ default: {} })
  emailConfig: EmailConfig

  @Prop({ default: {}, required: true })
  notifications: Notifications

  @Prop({ default: {} })
  public account: Account

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword)
    } catch (err) {
      console.log(err)
      return false
    }
  }

  public static async checkExists(
    this: ReturnModelType<typeof User>,
    email: string
  ) {
    return this.findOne({ email })
      .lean()
      .then((user) => user)
  }

  public static async verifyEmailConfirmationCode(
    this: ReturnModelType<typeof User>,
    code: string
  ) {
    const user = await this.findOne({ 'emailConfig.verificationCode': code })

    if (!user) throw new Error('Invalid email verification code')

    // if (user.emailConfig.expiration && user.emailConfig.expiration < new Date())
    //   throw new Error('verification code expired')
    // // todo
    if (user.emailConfig.isEmailVerified)
      throw new Error('Email already verified')

    user.emailConfig.isEmailVerified = true

    user.emailConfig.verificationCode = ''

    return await user.save()
  }
  
  public static async login(
    this: ReturnModelType<typeof User>,
    email: string,
    password: string
  ) {

    const user = await this.findOne({ email })

    if (!user) throw new Error('Invalid email or password')

    const isPasswordValid = await user.validatePassword(password)

    if (!isPasswordValid) throw new Error('Invalid email or password')

    return user
  }
}

const UserModel = getModelForClass(User)

export default UserModel
