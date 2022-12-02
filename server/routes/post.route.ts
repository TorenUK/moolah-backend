import express from 'express'
import {getAllPosts} from '@controller/post.controller'

const router = express.Router()

router.get('/api/allPosts', getAllPosts)

export default router
