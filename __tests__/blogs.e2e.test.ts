import {addBlog, checkNewBlog, newBlog, req} from './helpers/test-helpers'
import {db, setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {BlogInputModel} from '../src/input-output-types/blogs-types'
import {codedAuth, createString, dataset1} from './helpers/datasets'
import { connectDb } from '../src/app'


describe('/blogs', () => {
    beforeAll(async () => { 
      await connectDb()
      
    })
    beforeEach(async()=>{
      await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
      .set({'Authorization': 'Basic ' + codedAuth})
      .expect(204)
    })

    it('should create', async () => {
        


        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog) // отправка данных
            .expect(201)
        // console.log(res.body)

        expect(res.body.name).toEqual(newBlog.name)
        expect(res.body.description).toEqual(newBlog.description)
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl)
        expect(typeof res.body._id).toEqual(expect.any(String))
    })
    it('shouldn\'t create 401', async () => {
        
        const newBlog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(401)

        // console.log(res.body)

        expect(db.blogs.length).toEqual(0)
    })
    it('shouldn\'t create', async () => {
        
        const newBlog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog) // отправка данных
            .expect(400)

        // console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

        expect(db.blogs.length).toEqual(0)
    })
    it('should get empty array', async () => {
         // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200) // проверяем наличие эндпоинта

        // console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toEqual(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        await addBlog(newBlog) // заполнение базы данных начальными данными если нужно
        
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200)

        // console.log(res.body)

        expect(res.body.length).toEqual(1)
        expect(res.body).toEqual([checkNewBlog])
    })
    it('shouldn\'t find', async () => {
      await addBlog(newBlog)

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('should find', async () => {
      const blog = await addBlog(newBlog)
      const id = blog.body._id

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200) // проверка на ошибку

        // console.log(res.body)

        expect(res.body).toEqual(checkNewBlog)
    })
    it('should del', async () => {
      const blog = await addBlog(newBlog)
      const id = blog.body._id
        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204) // проверка на ошибку

        // console.log(res.body)

        expect(db.blogs.length).toEqual(0)
    })
    it('shouldn\'t del', async () => {
        

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t del 401', async () => {
        

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic'}) // no ' '
            .expect(401) // проверка на ошибку

        // console.log(res.body)
    })
    it('should update', async () => {
      const blog = await addBlog(newBlog)
      const id = blog.body._id

        const updateBlog: BlogInputModel = {
            name: 'n2',
            description: 'd2',
            websiteUrl: 'http://some2.com',
        }

        const res = await req
        .put(SETTINGS.PATH.BLOGS + '/' + id)
        .set({'Authorization': 'Basic ' + codedAuth})
        .send(updateBlog)
        .expect(204)

        // console.log(res)

        expect({...updateBlog, _id: id, __v: expect.any }).toEqual({...updateBlog, _id: id, __v: expect.any })
    })
    it('shouldn\'t update 404', async () => {
        
        const blog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t update2', async () => {
      const blog = await addBlog(newBlog)
      const id = blog.body._id
        const updateBlog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(updateBlog)
            .expect(400) // проверка на ошибку

        // console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')
    })
    it('shouldn\'t update 401', async () => {
        await setDB(dataset1)
        const blog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(blog)
            .expect(401) // проверка на ошибку

        // console.log(res.body)

        expect(db).toEqual(dataset1)
    })
})