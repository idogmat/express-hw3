import {Router} from 'express'
import { blogCollection, postCollection } from '../../app'
export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  const posts = await postCollection.deleteMany({})
  const blogs = await blogCollection.deleteMany({})
  res.status(204).json({})
})