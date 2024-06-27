import express from 'express'
import cors from 'cors'
import { SETTINGS } from './settings'
import { blogsRouter } from './features/blogs'
import { testingRouter } from './features/testing'
import { postsRouter } from './features/posts'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
const tokenDB = process.env.CONNECTION || ''

export const client = new MongoClient(tokenDB);
export const db = client.db('blogs');
export const blogCollection = client.db('blogs').collection('Blog')
export const postCollection = client.db('blogs').collection('Post')
export const connectDb = async () => {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');



    // the following code examples can be pasted here...
  
    return 'done.';
}

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.0' })
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)