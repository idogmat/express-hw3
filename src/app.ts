import express from 'express'
import cors from 'cors'
import { SETTINGS } from './settings'
import { blogsRouter } from './features/blogs'
import { testingRouter } from './features/testing'
import { postsRouter } from './features/posts'
import { Collection, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { authRouter } from './features/auth'
import { usersRouter } from './features/users'
import { BlogTypeBD, CommentTypeDB, DeviceTypeDB, LogTypeDB, PostTypeBD, UserTypeDB } from './db/db'
import { commentsRouter } from './features/comments'
import cookieParser from 'cookie-parser'
import { loggerMiddleware } from './global-middlewares/loggerMiddleware'
import { devicesRouter } from './features/devices'
dotenv.config()
const tokenDB = process.env.CONNECTION || ''

export const client = new MongoClient(tokenDB);
export const db = client.db('blogs');
export const blogCollection: Collection<BlogTypeBD> = client.db('blogs').collection<BlogTypeBD>('Blog')
export const postCollection: Collection<PostTypeBD> = client.db('posts').collection<PostTypeBD>('Post')
export const userCollection: Collection<UserTypeDB> = client.db('users').collection<UserTypeDB>('User')
export const commentCollection: Collection<CommentTypeDB> = client.db('comments').collection<CommentTypeDB>('Comment')
export const logCollection: Collection<LogTypeDB> = client.db('log').collection<LogTypeDB>('Log')
export const deviceCollection: Collection<DeviceTypeDB> = client.db('device').collection<DeviceTypeDB>('Device')


export const connectDb = async () => {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');



    // the following code examples can be pasted here...
  
    return 'done.';
}

export const app = express();
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors({origin: true, credentials: true})); //
app.use(cookieParser());
app.set('trust proxy', true)
app.use(loggerMiddleware)
app.get('/', (req, res) => {
  res.status(200).json({ version: '1.8' })
})


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.DEVICES, devicesRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)

