import { AuthController } from "./auth/authController";
import { AuthRepository } from "./auth/authRepository";
import { UserController } from "./user/userController";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "./user/userRepository";


export const userRepository = new UserRepository();
export const authRepository = new AuthRepository(userRepository);
export const authService = new AuthService(authRepository);
export const authController = new AuthController(authService, authRepository);
export const userController = new UserController(authService, userRepository);