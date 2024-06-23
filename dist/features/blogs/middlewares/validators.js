"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogCreateValidators = exports.findBlogValidator = exports.websiteUrlValidator = exports.descriptionValidator = exports.nameValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../../db/db");
// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
// --BLOGS
exports.nameValidator = (0, express_validator_1.body)('name').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 15 }).withMessage('more then 15 or 0');
exports.descriptionValidator = (0, express_validator_1.body)('description').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 500 }).withMessage('more then 500 or 0');
exports.websiteUrlValidator = (0, express_validator_1.body)('websiteUrl').isString().withMessage('not string')
    .trim().isLength({ min: 1, max: 100 }).custom(url => {
    const regex = /^(http|https):\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    return regex.test(url);
}).withMessage('not valid websiteUrl');
const findBlogValidator = (req, res, next) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res
            .status(404)
            .json({});
        return;
    }
    const blog = db_1.blogCollection.findById(req.params.id);
    if (!blog) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
};
exports.findBlogValidator = findBlogValidator;
exports.blogCreateValidators = [
    exports.nameValidator,
    exports.descriptionValidator,
    exports.websiteUrlValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
