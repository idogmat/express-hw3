import {addBlog, addPost, newBlog, newPost, req} from './helpers/test-helpers'
import {SETTINGS} from '../src/settings'
import { codedAuth, createString} from './helpers/datasets'
import {PostInputModel} from '../src/input-output-types/posts-types'
import { connectDb } from '../src/app'




describe('/posts', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
      await connectDb();  
    })

    beforeEach(async()=>{
      await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
      .set({'Authorization': 'Basic ' + codedAuth})
      .expect(204)
    })

    it('should create', async () => {
        const blog = await addBlog(newBlog)
        const newPost: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: blog.body.id,
            blogName: blog.body.name,
            createdAt: new Date()
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(201)

        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(newPost.blogName)
        expect(typeof res.body.id).toEqual('string')

        expect(res.body).toEqual({...newPost, id: expect.any(String), createdAt: expect.any(String) })
    })
    it('shouldn\'t create 401', async () => {
        const blog = await addBlog(newBlog)
        const newPost: PostInputModel = {
          title: 't1',
          shortDescription: 's1',
          content: 'c1',
          blogId: blog.body.id,
          blogName: blog.body.name,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

        // expect(db.posts.length).toEqual(0)
    })
    it('shouldn\'t create', async () => {
      const newPost: PostInputModel = {
        title: '',
        shortDescription: '',
        content: '',
        blogId: '',
        blogName: '',
      }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

    })
    it('should get empty array', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200) // проверяем наличие эндпоинта

        expect(res.body.items.length).toEqual(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        const blog = await addBlog(newBlog)
        const post = await addPost(blog.body.id, newPost);
        const post2 = await addPost(blog.body.id, newPost);
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200)

        expect(res.body.items.length).not.toEqual(0)
    })
    it('shouldn\'t find', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(404) // проверка на ошибку
    })
    it('should find', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200) // проверка на ошибку

        expect(res.body).toEqual({...post.body, id: expect.any(String), createdAt: expect.any(String)})
    })
    it('should del', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);

        await req
            .delete(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204) // проверка на ошибку

          const res = await req
          .get(SETTINGS.PATH.POSTS)
          .set({'Authorization': 'Basic ' + codedAuth})
          .expect(200)
        expect(res.body.items.length).toEqual(0)
    })
    it('shouldn\'t del', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404) // проверка на ошибку

    })
    it('shouldn\'t del 401', async () => {
        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .expect(401) // проверка на ошибку
    })
    it('should update', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);
        const updatePost: PostInputModel = {
            title: 't2sdfdsf',
            shortDescription: 's2sdfdsf',
            content: 'c2sdfdsf',
            blogId: blog.body.id,
            
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(updatePost)
            .expect(204) // проверка на ошибку


        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200)

        expect(res.body).toEqual({...post.body, ...updatePost, id: expect.any(String), createdAt: expect.any(String) })
    })
    it('shouldn\'t update 404', async () => {
      const blog = await addBlog(newBlog)
        const post: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: blog.body.id,
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(404) // проверка на ошибку
    })
    it('shouldn\'t update2', async () => {
      const blog = await addBlog(newBlog)
        const newPPost: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '',
            createdAt: new Date()
        }

        const post = await addPost(blog.body.id, newPost);


        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPPost)
            .expect(400) // проверка на ошибку

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')
    })
    it('shouldn\'t update 401', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);
        const newPPost: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: blog.body.id,
            createdAt: new Date()
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .send(newPPost)
            .expect(401) // проверка на ошибку
    })
})