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
exports.app = exports.postCollection = exports.blogCollection = exports.PostSchema = exports.BlogSchema = exports.connectDb = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./settings");
const blogs_1 = require("./features/blogs");
const testing_1 = require("./features/testing");
const posts_1 = require("./features/posts");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenDB = process.env.CONNECTION || '';
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(tokenDB);
        console.log('great', connection.connection.host);
    }
    catch (error) {
        console.log(error);
        process.exit(0);
    }
});
exports.connectDb = connectDb;
exports.BlogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
});
exports.PostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    shortDescription: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: false },
});
exports.blogCollection = mongoose_1.default.model('Blog', exports.BlogSchema);
exports.postCollection = mongoose_1.default.model('Post', exports.PostSchema);
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
exports.app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.0' });
});
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, posts_1.postsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testing_1.testingRouter);
