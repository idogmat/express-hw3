import { Router } from "express";
import { createController } from "./controllers/createController";
import { getController } from "./controllers/getController";
import { userCreateValidators } from "./middlewares/validators";
import { deleteController } from "./controllers/deleteController";


export const usersRouter = Router()

usersRouter.get('/', getController)
usersRouter.post('/', ...userCreateValidators, createController)
usersRouter.delete('/:id', deleteController)