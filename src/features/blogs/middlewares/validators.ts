import { body, param } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { Types } from "mongoose";
import { blogCollection } from "../../../db/db";

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

// --BLOGS

export const nameValidator = body("name")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("more then 15 or 0");

export const descriptionValidator = body("description")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more then 500 or 0");

export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .custom((url) => {
    const regex =
      /^(http|https):\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    return regex.test(url);
  })
  .withMessage("not valid websiteUrl");

export const blogIdParamsValidator = param("id")
  .isString()
  .trim()
  .withMessage("not string")
  .isLength({ min: 1, max: 500 })
  .withMessage("not found")
  .custom(async (value) => {
    if (!Types.ObjectId.isValid(value)) {
      return Promise.reject("id not found");
    }
    const blog = await blogCollection.findOne({
      _id: new Types.ObjectId(value),
    });
    if (!blog?._id) {
      return Promise.reject("id not found");
    }
    return true;
  });

export const blogCreateValidators = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  inputCheckErrorsMiddleware,
];
