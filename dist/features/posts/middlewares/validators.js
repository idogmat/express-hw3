"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreateValidators = exports.findPostValidator = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const blogsRepository_1 = require("../../blogs/blogsRepository");
const postsRepository_1 = require("../postsRepository");
// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid
// --POSTS
exports.titleValidator = (0, express_validator_1.body)('title').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 30 }).withMessage('more then 30 or 0');
exports.shortDescriptionValidator = (0, express_validator_1.body)('shortDescription').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 100 }).withMessage('more then 100 or 0');
exports.contentValidator = (0, express_validator_1.body)('content').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 1000 }).withMessage('more then 1000 or 0');
exports.blogIdValidator = (0, express_validator_1.body)('blogId').isString().withMessage('not string')
    .trim().custom(blogId => {
    const blog = blogsRepository_1.blogsRepository.find(blogId);
    return !!blog;
}).withMessage('no blog');
const findPostValidator = (req, res, next) => {
    const post = postsRepository_1.postsRepository.find(req.params.id);
    if (!post) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
};
exports.findPostValidator = findPostValidator;
exports.postCreateValidators = [
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    exports.blogIdValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
