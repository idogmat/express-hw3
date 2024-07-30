import "reflect-metadata";
import { Container } from "inversify";
import { AuthController } from "./auth/authController";
import { AuthRepository } from "./auth/authRepository";
import { UserController } from "./user/userController";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "./user/userRepository";
import { UserQueryRepository } from "./user/userQueryRepository";
import { PostRepository } from "./post/postRepository";
import { PostQueryRepository } from "./post/postQueryRepository";
import { CommentRepository } from "./comment/commentRepository";
import { BlogRepository } from "./blog/blogRepository";
import { BlogQueryRepository } from "./blog/blogQueryRepository";
import { BlogController } from "./blog/blogController";
import { PostController } from "./post/postController";
import { CommentController } from "./comment/commentController";
import { DeviceController } from "./device/deviceController";
import { DeviceRepository } from "./device/deviceRepository";
import { DeviceQueryRepository } from "./device/deviceQueryRepository";

export const container = new Container();

container.bind<UserRepository>(UserRepository).to(UserRepository);
container
  .bind<UserQueryRepository>(UserQueryRepository)
  .to(UserQueryRepository);
container.bind<UserController>(UserController).to(UserController);
container.bind<AuthRepository>(AuthRepository).to(AuthRepository);
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<PostController>(PostController).to(PostController);
container.bind<CommentRepository>(CommentRepository).to(CommentRepository);
container.bind<CommentController>(CommentController).to(CommentController);
container.bind<BlogController>(BlogController).to(BlogController);
container.bind<PostRepository>(PostRepository).to(PostRepository);
container.bind<BlogRepository>(BlogRepository).to(BlogRepository);
container
  .bind<BlogQueryRepository>(BlogQueryRepository)
  .to(BlogQueryRepository);
container
  .bind<PostQueryRepository>(PostQueryRepository)
  .to(PostQueryRepository);
container.bind<AuthController>(AuthController).to(AuthController);
container.bind<DeviceController>(DeviceController).to(DeviceController);
container.bind<DeviceRepository>(DeviceRepository).to(DeviceRepository);
container
  .bind<DeviceQueryRepository>(DeviceQueryRepository)
  .to(DeviceQueryRepository);
