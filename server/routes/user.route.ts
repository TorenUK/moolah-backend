import express from 'express'
import validateResource from '@middleware/validate.resource'
import { createUserSchema } from '@validation/user.schema'
import { createUser } from '@controller/user.controller'
import { verifyEmailConfirmationCode } from '@controller/user.controller'

const router = express.Router()

router.post('/api/users', validateResource(createUserSchema), createUser)
router.get('/api/users/verifyEmail', verifyEmailConfirmationCode)

export default router
