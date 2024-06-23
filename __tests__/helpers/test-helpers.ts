import {app} from '../../src/app'
import {Response, agent} from 'supertest'
import { SETTINGS } from '../../src/settings';
import { codedAuth } from './datasets';
import { BlogInputModel } from '../../src/input-output-types/blogs-types';
import { PostInputModel } from '../../src/input-output-types/posts-types';

export const req = agent(app);


export const newPost: PostInputModel = {
  title: 't1',
  shortDescription: 's1',
  content: 'c1',
  blogId: '',
  blogName: '',
  createdAt: new Date()
}

export const newBlog: BlogInputModel = {
  name: 'n1',
  description: 'd1',
  websiteUrl: 'http://some.com',
  createdAt: new Date()
}

type PostType = PostInputModel & {_id: string; __v: number}

export const checkNewPost = {...newPost, _id: expect.any(String), __v: expect.any(Number)}

type BlogType = BlogInputModel & {_id: string; __v: number}

export const checkNewBlog = {...newBlog, _id: expect.any(String), __v: expect.any(Number)}

export async function addBlog(newBlog: BlogInputModel): Promise<Response> {
  return req.post(SETTINGS.PATH.BLOGS)
    .set({'Authorization': 'Basic ' + codedAuth})
    .send(newBlog) // отправка данных
    .expect(201)
}

export async function addPost(id: string, newBlog: PostInputModel): Promise<Response> {
  return req.post(SETTINGS.PATH.POSTS)
    .set({'Authorization': 'Basic ' + codedAuth})
    .send({...newPost, blogId: id}) // отправка данных
    .expect(201)
}