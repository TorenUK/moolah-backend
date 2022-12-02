import {Prop, prop} from '@typegoose/typegoose'
import mongoose from 'mongoose'

export class Survey {
  @prop()
  id: string

  @prop()
  time: number

  @prop()
  reward: number

  @prop({type: mongoose.Schema.Types.Buffer})
  image: string

  @Prop({required: true})
  description: string

  @Prop({required: true})
  category: string
}
