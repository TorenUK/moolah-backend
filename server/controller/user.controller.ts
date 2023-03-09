import { Request, Response, NextFunction } from 'express'
import { CreateUserInput } from '@validation/user.schema'
import { createUserService } from '@services/user.service'
import UserModel from '@model/user.model'
import { toBadRequestError, toUnexpectedError } from '@domain/Error'

export const createUser = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body

  const { email } = body

  try {
    const exists = await UserModel.checkExists(email)

    if (exists) {
      return next(toBadRequestError('User already exists'))
      // todo send email if already exists
    }

    await createUserService(body)

    return res.send('User successfully created')
  } catch (err) {
    return next(toUnexpectedError(err))
  }
}

export const login = async ( req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
  ) => {
  const body = req.body

  const { email, password } = body

  try {

    const user = await UserModel.login(email, password)

    if (!user) {
      return next(toBadRequestError('Invalid credentials'))
    }

    return res.send('User successfully logged in')

  } catch (err) {
    return next(toUnexpectedError(err))
  }
}

export const verifyEmailConfirmationCode = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.query as { code: string }

  try {
    const user = await UserModel.verifyEmailConfirmationCode(code)

    if (!user) {
      return next(toBadRequestError('Invalid email verification code'))
    }

    return res.send('Email successfully verified')
  } catch (err) {
    return next(toUnexpectedError(err))
  }
}
