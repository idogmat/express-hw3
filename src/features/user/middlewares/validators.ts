import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";

// --POSTS
export const loginValidator = body("login")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("more then 30 or 0")
  .custom((login) => {
    const regex = /^[a-zA-Z0-9_-]*$/;
    if (!regex.test(login)) {
      return Promise.reject("not valid");
    }
    return true;
  });

export const passwordValidator = body("password")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("more then 100 or 0");

export const emailValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .withMessage("not valid email")
  .custom(async (email) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) return Promise.reject();
    return Promise.resolve();
  });

export const userCreateValidators = [
  loginValidator,
  passwordValidator,
  emailValidator,
  inputCheckErrorsMiddleware,
];
