"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const delBlogController = (req, res) => {
    if (blogsRepository_1.blogsRepository.del(req.params.id))
        res.sendStatus(204);
    else
        res.sendStatus(404);
};
exports.delBlogController = delBlogController;
