import express from 'express'
import cors from 'cors'
import {SETTINGS} from './settings'
import {blogsRouter} from './features/blogs'
import {testingRouter} from './features/testing'
import {postsRouter} from './features/posts'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const tokenDB = process.env.CONNECTION || ''
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(tokenDB)
    console.log('great', connection.connection.host)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

export const BlogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
})

export const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: false },
})

export const blogCollection = mongoose.model('Blog', BlogSchema)
export const postCollection = mongoose.model('Post', PostSchema)



export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)