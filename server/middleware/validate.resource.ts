import {
  toValidationError,
  ValidationError,
  ValidationErrors
} from '@domain/Error'
import {Request, Response, NextFunction} from 'express'
import {AnyZodObject, ZodError as ZodValidationError} from 'zod'

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })

      next()
    } catch (err) {
      return next(mapZodErrors(err as ZodValidationError))
    }
  }

const mapZodErrors = (errors: ZodValidationError): ValidationError => {
  const pattern = 'body' // todo query|params

  const _errors = errors.issues.reduce((acc, currErr) => {
    const _path = currErr.path.join('').replace(pattern, '')

    return {
      ...acc,
      ...{
        [_path]: currErr.message
      }
    }
  }, {})

  return toValidationError(_errors)
}

export default validateResource
