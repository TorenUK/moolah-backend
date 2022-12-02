import {Request, Response, NextFunction} from 'express'
import {CreateUserInput} from '@validation/user.schema'
import {createUserService} from '@services/user.service'
import UserModel from '@model/user.model'
import {toBadRequestError, toUnexpectedError} from '@domain/Error'

export const createUser = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body

  const {email} = body

  try {
    const exists = await UserModel.checkExists(email)

    if (exists) {
      return next(toBadRequestError('User already exists'))
      // todo send email if already exists
    }

    const user = await createUserService(body)

    return res.send('User successfully created')
  } catch (err) {
    return next(toUnexpectedError(err))
  }
}
