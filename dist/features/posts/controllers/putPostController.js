"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const putPostController = (req, res) => {
    const result = postsRepository_1.postsRepository.put(Object.assign({}, req.body), req.params.id);
    if (result)
        res.sendStatus(204);
    else
        res.sendStatus(404);
};
exports.putPostController = putPostController;
