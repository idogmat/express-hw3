import {addBlog, addPost, newBlog, newPost, req} from './helpers/test-helpers'
import {SETTINGS} from '../src/settings'
import {codedAuth, createString, dataset1, dataset2} from './helpers/datasets'
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
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(201)

        // console.log(res.body)

        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(dataset1.blogs[0].name)
        expect(typeof res.body.id).toEqual('string')

        expect(res.body).toEqual({...newPost, id: expect.any(String) })
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

        // console.log(res.body)

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

        // console.log(res.body)

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

        // console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toEqual(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        const blog = await addBlog(newBlog)
        const post = await addPost(blog.body.id, newPost);
        const post2 = await addPost(blog.body.id, newPost);
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200)

        // console.log(res.body)

        expect(res.body.length).not.toEqual(0)
    })
    it('shouldn\'t find', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('should find', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(200) // проверка на ошибку

        // console.log(res.body)

        expect(res.body).toEqual(post.body)
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

        expect(res.body.length).toEqual(0)
    })
    it('shouldn\'t del', async () => {
      const blog = await addBlog(newBlog)
      const post = await addPost(blog.body.id, newPost);

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404) // проверка на ошибку

        // console.log(res.body)
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
        // console.log(res.body)

        expect(res.body).toEqual({...post.body, ...updatePost, id: expect.any(String)})
    })
    it('shouldn\'t update 404', async () => {
        const post: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t update2', async () => {
      const blog = await addBlog(newBlog)
        const newPPost: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '',
        }

        const post = await addPost(blog.body.id, newPost);


        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPPost)
            .expect(400) // проверка на ошибку

        // console.log(res.body)

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
            blogId: '1sdfsdfsdfdsfsd',
        }

        await req
            .put(SETTINGS.PATH.POSTS + '/' + post.body.id)
            .send(newPPost)
            .expect(401) // проверка на ошибку

        // console.log(res.body)
        await req
        .get(SETTINGS.PATH.POSTS + '/' + post.body.id)
        .set({'Authorization': 'Basic ' + codedAuth})
        .expect(200, post.body)
    })
})