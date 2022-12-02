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

// pre-save hook to hash passwords
@pre<User>('save', async function () {
  if (!this.isModified('password')) return

  const hash = await argon2.hash(this.password)

  this.password = hash

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

  @Prop({required: true, default: () => nanoid()})
  verificationCode: string

  @Prop()
  passwordResetCode: string | null

  @Prop({default: false})
  verified: boolean

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
}

const UserModel = getModelForClass(User)

export default UserModel
