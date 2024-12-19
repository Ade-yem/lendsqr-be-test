import { Router} from "express";
import { AccountController } from "../controllers/accountController";
import AuthController from "../controllers/authController";

const accountRouter = Router();
accountRouter.post("/create-account", AuthController.verifyToken, AccountController.createAccount);
accountRouter.post("/fund-account", AuthController.verifyToken, AccountController.fundAccount);
accountRouter.post("/withdraw", AuthController.verifyToken, AccountController.withdrawFunds);
accountRouter.post("/transfer", AuthController.verifyToken, AccountController.transferFunds);

export default accountRouter;