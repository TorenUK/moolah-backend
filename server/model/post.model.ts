import {Prop, getModelForClass} from '@typegoose/typegoose'

export class Post {
  @Prop()
  title: string

  @Prop()
  image: string

  @Prop()
  url: string

  @Prop()
  type: string

  @Prop()
  timeToCashOut: string

  @Prop()
  description: string
}

const PostModel = getModelForClass(Post)

export default PostModel
