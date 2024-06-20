"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db/db");
exports.blogsRepository = {
    create(blog) {
        const newBlog = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        db_1.db.blogs = [...db_1.db.blogs, newBlog];
        return newBlog.id;
    },
    find(id) {
        return db_1.db.blogs.find(b => b.id === id);
    },
    findAndMap(id) {
        const blog = this.find(id); // ! используем этот метод если проверили существование
        return this.map(blog);
    },
    getAll() {
        return db_1.db.blogs.map(b => this.map(b));
    },
    del(id) {
        const index = db_1.db.blogs.findIndex(b => (b.id === id));
        if (index < 0)
            return false;
        db_1.db.blogs.splice(index, 1);
        return true;
    },
    put(blog, id) {
        const foundBlog = db_1.db.blogs.find(b => (b.id === id));
        if (!foundBlog)
            return false;
        db_1.db.blogs = db_1.db.blogs.map(b => {
            return b.id === id ? Object.assign(Object.assign({}, b), blog) : b;
        });
        return true;
    },
    map(blog) {
        const blogForOutput = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        };
        return blogForOutput;
    },
};
