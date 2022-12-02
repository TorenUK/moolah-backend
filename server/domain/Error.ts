import {toError} from 'fp-ts/Either'
import {pipe} from 'fp-ts/function'

export type Error = ValidationError | BadRequestError | UnexpectedError

export type UnexpectedError = {
  _type: 'UnexpectedError'
  message: string
}

export type BadRequestError = {
  _type: 'BadRequestError'
  message: string
}

export type ValidationError = {
  _type: 'ValidationError'
  errors: ValidationErrors
}

export type ValidationErrors = Record<string, string>

export const toUnexpectedError = (err: any): UnexpectedError =>
  pipe(err, toError, (err) => ({
    _type: 'UnexpectedError',
    message: err.message
  }))
export const toBadRequestError = (message: string): BadRequestError => ({
  _type: 'BadRequestError',
  message
})
export const toValidationError = (
  errors: ValidationErrors
): ValidationError => ({
  _type: 'ValidationError',
  errors
})
