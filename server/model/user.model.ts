import {
  getModelForClass,
  modelOptions,
  Prop,
  Severity,
  pre,
  DocumentType,
  ReturnModelType
} from '@typegoose/typegoose'
import {nanoid} from 'nanoid'
import argon2 from 'argon2'
import {Account} from '@model/account.model'
import {
  sendVerificationEmail,
  generateEmailVerificationHTML
} from '@modules/email'
import {toBadRequestError} from '@domain/Error'

class EmailConfig {
  @Prop({default: false, required: true})
  isEmailVerified: boolean

  @Prop({default: '', unique: true})
  verificationCode: string
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

  this.emailConfig.verificationCode = nanoid()

  // sendVerificationEmail({
  //   from: 'moolah.guru',
  //   to: this.email,
  //   subject: 'Verify your email',
  //   html: generateEmailVerificationHTML(this.emailConfig.verificationCode)
  // })

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
  @Prop({lowercase: true, required: true, unique: true})
  email: string

  @Prop({required: true})
  firstName: string

  @Prop({required: true})
  lastName: string

  @Prop({required: true})
  password: string

  @Prop()
  passwordResetCode: string | null

  @Prop({default: {}})
  emailConfig: EmailConfig

  @Prop({default: {}})
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
    return this.findOne({email})
      .lean()
      .then((user) => user)
  }

  public static async verifyEmailConfirmationCode(
    this: ReturnModelType<typeof User>,
    code: string
  ) {
    const user = await this.findOne({'emailConfig.verificationCode': code})

    if (!user) throw new Error('Invalid email verification code')

    if (user.emailConfig.isEmailVerified)
      throw new Error('Email already verified')

    user.emailConfig.isEmailVerified = true

    return await user.save()
  }
}

const UserModel = getModelForClass(User)

export default UserModel
