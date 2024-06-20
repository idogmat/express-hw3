"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const delPostController = (req, res) => {
    if (postsRepository_1.postsRepository.del(req.params.id))
        res.sendStatus(204);
    else
        res.sendStatus(404);
};
exports.delPostController = delPostController;
