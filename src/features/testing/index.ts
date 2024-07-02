import { Router } from 'express'
import { blogCollection, commentCollection, postCollection, userCollection } from '../../app'
export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  const posts = await postCollection.deleteMany({});
  const blogs = await blogCollection.deleteMany({});
  const users = await userCollection.deleteMany({});
  const comments = await commentCollection.deleteMany({});
  res.status(204).json({});
})