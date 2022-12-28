import {object, string, TypeOf} from 'zod'

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required'
    }),
    lastName: string({
      required_error: 'Last name is required'
    }),
    password: string({
      required_error: 'Password is required'
    })
      .min(8, 'Password too short -- 8 characters required')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    }),
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email')
  }).refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords do not match'
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
