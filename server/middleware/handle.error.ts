import {NextFunction, Request, Response} from 'express'
import {Error} from '@domain/Error'

export const handleError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (error._type) {
    case 'ValidationError':
    case 'BadRequestError':
      return res.status(400).json(error)
    case 'UnexpectedError':
      return res.status(500).json(error)
  }
}
