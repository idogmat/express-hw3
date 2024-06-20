"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const putBlogController = (req, res) => {
    const result = blogsRepository_1.blogsRepository.put(Object.assign({}, req.body), req.params.id);
    if (result)
        res.sendStatus(204);
    else
        res.sendStatus(404);
};
exports.putBlogController = putBlogController;
