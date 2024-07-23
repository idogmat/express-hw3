import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrorsMiddleware";
import { NextFunction, Request, Response } from "express";
import { blogIdParamsValidator } from "../../blogs/middlewares/validators";
import { Types } from "mongoose";
import { blogCollection, postCollection } from "../../../db";

export const titleValidator = body("title")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("more then 30 or less then 0");

export const shortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or less then 0");

export const contentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("more then 1000 or less then 0");

export const commentContentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("more then 300 or less then 20");

export const blogIdValidator = body("blogId")
  .isString()
  .trim()
  .withMessage("not string")
  .isLength({ min: 1, max: 500 })
  .withMessage("no blog")
  .custom(async (value) => {
    if (!Types.ObjectId.isValid(value)) {
      return Promise.reject("blog not found");
    }
    const blog = await blogCollection.findOne({
      _id: new Types.ObjectId(value),
    });
    if (!blog?._id) {
      return Promise.reject("blog not found");
    }
    return true;
  });

export const findPostValidator = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(404).json({});
    return;
  }
  const post = await postCollection.findOne({
    _id: new Types.ObjectId(req.params.id),
  });
  if (!post) {
    res.status(404).json({});
    return;
  }

  next();
};

export const postCreateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputCheckErrorsMiddleware,
];

export const postCreateValidatorsWithBlogId = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdParamsValidator,
  inputCheckErrorsMiddleware,
];

export const putUpdateValidators = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  findPostValidator,
  inputCheckErrorsMiddleware,
];
