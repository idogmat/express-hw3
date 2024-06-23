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
exports.blogsRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../db/db");
exports.blogsRepository = {
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date(),
                isMembership: false,
            };
            const model = new db_1.blogCollection(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, newBlog));
            const result = yield model.save();
            return result._id;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.findById(id);
            if (blog) {
                return this.map(blog);
            }
            return {};
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.findById(id);
            if (blog) {
                return this.map(blog);
            }
            return {};
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_1.blogCollection.find();
            return blogs.map(b => this.map(b));
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogCollection.findById(id);
            if (!(blog === null || blog === void 0 ? void 0 : blog.name))
                return false;
            yield db_1.blogCollection.deleteOne({ _id: id });
            return true;
        });
    },
    put(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.blogCollection.findByIdAndUpdate(id, Object.assign({}, blog));
                return true;
            }
            catch (error) {
                return false;
            }
        });
    },
    map(blog) {
        const blogForOutput = {
            id: blog._id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
        return blogForOutput;
    },
};
