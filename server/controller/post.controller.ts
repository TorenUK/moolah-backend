import {Request, Response, NextFunction} from 'express'
import {toUnexpectedError} from '@domain/Error'
import {getPosts} from '@services/post.service'

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await getPosts()

    if (!posts.length) {
      return next(
        toUnexpectedError('Unable to get content - please try again later')
      )
    }

    return res.status(200).json(posts)
  } catch (err) {
    return next(toUnexpectedError(err))
  }
}
