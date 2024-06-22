"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.fromUTF8ToBase64 = exports.fromBase64ToUTF8 = void 0;
const settings_1 = require("../settings");
const fromBase64ToUTF8 = (code) => {
    const buff = Buffer.from(code, 'base64');
    // console.log(buff)
    const decodedAuth = buff.toString('utf8');
    // console.log(decodedAuth)
    return decodedAuth;
};
exports.fromBase64ToUTF8 = fromBase64ToUTF8;
const fromUTF8ToBase64 = (code) => {
    const buff2 = Buffer.from(code, 'utf8');
    // console.log(buff2)
    const codedAuth = buff2.toString('base64');
    // console.log(codedAuth)
    return codedAuth;
};
exports.fromUTF8ToBase64 = fromUTF8ToBase64;
const adminMiddleware = (req, res, next) => {
    var _a;
    const auth = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a['authorization']; // 'Basic xxxx'
    // console.log(auth)
    if (!auth) {
        res
            .status(401)
            .json({});
        return;
    }
    const token = auth.split(' ');
    if ((token === null || token === void 0 ? void 0 : token.length) !== 2 || token[0] !== 'Basic') {
        res
            .status(401)
            .json({});
        return;
    }
    const codedAuth = (0, exports.fromUTF8ToBase64)(settings_1.SETTINGS.ADMIN);
    // console.log(codedAuth)
    // console.log(token[1])
    // if (decodedAuth !== SETTINGS.ADMIN) {
    if (token[1] !== codedAuth) {
        res
            .status(401)
            .json({});
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
