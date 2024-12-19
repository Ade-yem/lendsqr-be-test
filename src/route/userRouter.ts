import { Router } from "express";
import AuthController from "../controllers/authController";
import UserController from "../controllers/userController";

const userRouter = Router();
userRouter.get("/get-user", AuthController.verifyToken, UserController.getUserData);
userRouter.post("/change-name", AuthController.verifyToken, UserController.updateName);
userRouter.post("/change-password", AuthController.verifyToken, UserController.updatePassword);
export default userRouter;
