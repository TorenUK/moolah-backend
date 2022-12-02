import PostModel from '@model/post.model'

export const getPosts = async () => await PostModel.find({})
