import { Router} from "express";
import { AccountController } from "../controllers/accountController";
import AuthController from "../controllers/authController";

const accountRouter = Router();
accountRouter.get("/get-account/:id", AuthController.verifyToken, AccountController.getAccount);
accountRouter.delete("/delete-account/:id", AuthController.verifyToken, AccountController.deleteAccount);
accountRouter.post("/create-account", AuthController.verifyToken, AccountController.createAccount);
accountRouter.post("/fund-account", AuthController.verifyToken, AccountController.fundAccount);
accountRouter.post("/withdraw", AuthController.verifyToken, AccountController.checkIfYouOwnAccount, AccountController.withdrawFunds);
accountRouter.post("/transfer", AuthController.verifyToken, AccountController.checkIfYouOwnAccount, AccountController.transferFunds);
accountRouter.get("/all-transactions/:accountNumber", AuthController.verifyToken, AccountController.checkIfYouOwnAccount, AccountController.getTransactions)
accountRouter.get("/filter-transactions/:accountNumber", AuthController.verifyToken, AccountController.checkIfYouOwnAccount, AccountController.filterTransactions)

export default accountRouter;
