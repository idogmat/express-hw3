"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const createPostController_1 = require("./controllers/createPostController");
const getPostsController_1 = require("./controllers/getPostsController");
const findPostController_1 = require("./controllers/findPostController");
const delPostController_1 = require("./controllers/delPostController");
const putPostController_1 = require("./controllers/putPostController");
const validators_1 = require("./middlewares/validators");
const admin_middleware_1 = require("../../global-middlewares/admin-middleware");
const inputCheckErrorsMiddleware_1 = require("../../global-middlewares/inputCheckErrorsMiddleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.post('/', ...validators_1.postCreateValidators, createPostController_1.createPostController);
exports.postsRouter.get('/', inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, getPostsController_1.getPostsController);
exports.postsRouter.get('/:id', validators_1.findPostValidator, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, findPostController_1.findPostController);
exports.postsRouter.delete('/:id', admin_middleware_1.adminMiddleware, validators_1.findPostValidator, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, delPostController_1.delPostController);
exports.postsRouter.put('/:id', admin_middleware_1.adminMiddleware, validators_1.findPostValidator, ...validators_1.postCreateValidators, inputCheckErrorsMiddleware_1.inputCheckErrorsMiddleware, putPostController_1.putPostController);
// не забудьте добавить роут в апп
