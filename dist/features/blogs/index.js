"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const createBlogController_1 = require("./controllers/createBlogController");
const getBlogsController_1 = require("./controllers/getBlogsController");
const findBlogController_1 = require("./controllers/findBlogController");
const delBlogController_1 = require("./controllers/delBlogController");
const putBlogController_1 = require("./controllers/putBlogController");
const validators_1 = require("./middlewares/validators");
const admin_middleware_1 = require("../../global-middlewares/admin-middleware");
const inputCheckErrorsMiddleware_1 = require("../../global-middlewares/inputCheckErrorsMiddleware");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.post('/', admin_middleware_1.adminMiddleware, ...validators_1.blogCreateValidators, createBlogController_1.createBlogController);
exports.blogsRouter.get('/', getBlogsController_1.getBlogsController, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware);
exports.blogsRouter.get('/:id', validators_1.findBlogValidator, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, findBlogController_1.findBlogController);
exports.blogsRouter.delete('/:id', admin_middleware_1.adminMiddleware, validators_1.findBlogValidator, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, delBlogController_1.delBlogController);
exports.blogsRouter.put('/:id', admin_middleware_1.adminMiddleware, validators_1.findBlogValidator, ...validators_1.blogCreateValidators, putBlogController_1.putBlogController);
// не забудьте добавить роут в апп
