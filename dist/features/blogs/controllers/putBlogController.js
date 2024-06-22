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
Object.defineProperty(exports, "__esModule", { value: true });
exports.putBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const putBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogsRepository_1.blogsRepository.put(Object.assign({}, req.body), req.params.id);
    if (result)
        res.sendStatus(204);
    else
        res.sendStatus(404);
});
exports.putBlogController = putBlogController;
