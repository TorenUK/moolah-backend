import {
  prop,
  getModelForClass,
  modelOptions,
  Severity
} from '@typegoose/typegoose'
import {nanoid} from 'nanoid'
import {shortUUID} from '@utils/UUID'

@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class BalanceHistoryItem {
  _id: false

  @prop({default: () => nanoid()})
  UUID: string

  @prop()
  type: string

  @prop({required: true})
  amount: number

  @prop({required: true})
  paypalEmail: string

  @prop({required: true})
  balanceBefore: number

  @prop({required: true})
  balanceAfter: number
}

export class Account {
  _id: false

  @prop({unique: true, default: () => shortUUID(), uppercase: true})
  UUID: string

  @prop({default: 0})
  balance: number

  @prop({default: false})
  isInSurvey: boolean

  @prop({default: 0})
  streak: number

  @prop({default: ''})
  paypalEmail: string

  @prop({default: 0})
  totalEarnings: number

  @prop({default: []})
  balanceHistory: [BalanceHistoryItem]
}

const AccountModel = getModelForClass(Account)

export default AccountModel
