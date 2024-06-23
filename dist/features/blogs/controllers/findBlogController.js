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
exports.findBlogController = void 0;
const blogsRepository_1 = require("../blogsRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const findBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.id);
    const data = yield blogsRepository_1.blogsRepository.find(id);
    res.status(200).json(data);
});
exports.findBlogController = findBlogController;
