import { Router} from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import accountRouter from "./accountRouter";

const mainRouter = Router()
mainRouter.use("/auth", authRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/account", accountRouter);
export default mainRouter;