"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const findBlogController = (req, res) => {
    const data = blogsRepository_1.blogsRepository.find(req.params.id);
    res.status(200).json(data);
};
exports.findBlogController = findBlogController;
