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
exports.postsRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../db/db");
exports.postsRepository = {
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.findById(post.blogId);
            if (!(blog === null || blog === void 0 ? void 0 : blog.name))
                return false;
            const newPost = {
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: blog.name,
            };
            const model = yield new db_1.postCollection(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, newPost));
            const result = yield model.save();
            return result._id;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.findById(id);
            if (post) {
                return this.map(post);
            }
            return {};
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.findById(id);
            if (post) {
                return this.map(post);
            }
            return {};
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postCollection.find();
            return posts.map(p => this.map(p));
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postCollection.findById(id);
            if (!(post === null || post === void 0 ? void 0 : post.title))
                return false;
            yield db_1.postCollection.deleteOne({ _id: id });
            return true;
        });
    },
    put(post, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.postCollection.findByIdAndUpdate(id, Object.assign({}, post));
                return true;
            }
            catch (error) {
                return false;
            }
        });
    },
    map(post) {
        const postForOutput = {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
        };
        return postForOutput;
    },
};
