"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCollection = exports.blogCollection = exports.PostSchema = exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.BlogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: false },
    isMembership: { type: Boolean, required: false }
});
exports.PostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    shortDescription: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: false },
    createdAt: { type: Date, required: false },
});
exports.blogCollection = mongoose_1.default.model('Blog', exports.BlogSchema);
exports.postCollection = mongoose_1.default.model('Post', exports.PostSchema);
