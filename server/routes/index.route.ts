import express from 'express'
import userRoute from '@routes/user.route'
import postRoute from '@routes/post.route'

const router = express.Router()
router.use('/user', userRoute)
router.use('/posts', postRoute)
router.get('/health', (req, res) => res.json({message: 'hi'}))

export default router
