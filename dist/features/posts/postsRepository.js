"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../../db/db");
const blogsRepository_1 = require("../blogs/blogsRepository");
exports.postsRepository = {
    create(post) {
        const newPost = {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogsRepository_1.blogsRepository.find(post.blogId).name,
        };
        console.log(newPost);
        db_1.db.posts = [...db_1.db.posts, newPost];
        return newPost.id;
    },
    find(id) {
        return db_1.db.posts.find(p => p.id === id);
    },
    findAndMap(id) {
        const post = this.find(id); // ! используем этот метод если проверили существование
        return this.map(post);
    },
    getAll() {
        return db_1.db.posts.map(p => this.map(p));
    },
    del(id) {
        const index = db_1.db.posts.findIndex(p => (p.id === id));
        if (index < 0)
            return false;
        db_1.db.posts.splice(index, 1);
        return true;
    },
    put(post, id) {
        const blog = blogsRepository_1.blogsRepository.find(post.blogId);
        if (blog) {
            db_1.db.posts = db_1.db.posts.map(p => p.id === id ? Object.assign(Object.assign(Object.assign({}, p), post), { blogName: blog.name }) : p);
            return true;
        }
        else {
            return false;
        }
    },
    map(post) {
        const postForOutput = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
        };
        return postForOutput;
    },
};
