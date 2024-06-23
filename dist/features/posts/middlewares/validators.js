"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putUpdateValidators = exports.postCreateValidators = exports.findPostValidator = exports.blogIdCheckIncludes = exports.blogIdValidator = exports.contentValidator = exports.shortDescriptionValidator = exports.titleValidator = void 0;
const express_validator_1 = require("express-validator");
const inputCheckErrorsMiddleware_1 = require("../../../global-middlewares/inputCheckErrorsMiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../../db/db");
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
exports.blogIdValidator = (0, express_validator_1.body)('blogId').isString().trim().withMessage('not string').isLength({ min: 1, max: 500 }).withMessage('no blog');
const blogIdCheckIncludes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.body.blogId)) {
        res
            .status(404)
            .json({});
        return;
    }
    const blog = yield db_1.blogCollection.findById(req.body.blogId);
    if (!(blog === null || blog === void 0 ? void 0 : blog._id)) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
});
exports.blogIdCheckIncludes = blogIdCheckIncludes;
const findPostValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res
            .status(404)
            .json({});
        return;
    }
    const post = yield db_1.postCollection.findById(req.params.id);
    if (!(post === null || post === void 0 ? void 0 : post._id)) {
        res
            .status(404)
            .json({});
        return;
    }
    next();
});
exports.findPostValidator = findPostValidator;
exports.postCreateValidators = [
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    exports.blogIdValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
exports.putUpdateValidators = [
    exports.titleValidator,
    exports.shortDescriptionValidator,
    exports.contentValidator,
    exports.blogIdValidator,
    inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware,
];
