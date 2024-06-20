"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const getBlogsController = (req, res) => {
    const data = blogsRepository_1.blogsRepository.getAll();
    res.status(200).json(data);
};
exports.getBlogsController = getBlogsController;
