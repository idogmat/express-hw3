import {Router} from 'express'
import { blogCollection, postCollection } from '../../app'
export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  const posts = await postCollection.deleteMany({})
  console.log(posts)
  const blogs = await blogCollection.deleteMany({})
  console.log(blogs)
  res.status(204).json({})
})