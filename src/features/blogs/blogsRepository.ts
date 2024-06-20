import {BlogDbType} from '../../db/blog-db-type'
import {db} from '../../db/db'
import {BlogInputModel, BlogViewModel} from '../../input-output-types/blogs-types'

export const blogsRepository = {
    create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        }
        db.blogs = [...db.blogs, newBlog]
        return newBlog.id
    },
    find(id: string) {
        return db.blogs.find(b => b.id === id)
    },
    findAndMap(id: string) {
        const blog = this.find(id)! // ! используем этот метод если проверили существование
        return this.map(blog)
    },
    getAll() {
      return db.blogs.map(b => this.map(b))
    },
    del(id: string) {
      const index = db.blogs.findIndex(b => (b.id === id));
      if (index < 0) return false
      db.blogs.splice(index, 1);
      return true
    },
    put(blog: BlogInputModel, id: string) {
      const foundBlog = db.blogs.find(b => (b.id === id));
      if (!foundBlog) return false
      db.blogs = db.blogs.map(b => {
        return b.id === id ? {...b, ...blog} : b;
      })
      return true
    },
    map(blog: BlogDbType) {
        const blogForOutput: BlogViewModel = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        }
        return blogForOutput
    },
}