import { NextFunction, Request, Response } from "express";
import {
  addMoneyToAccount,
  checkOwner,
  confirmAccountAndId,
  createWalletAccount,
  deleteAccountById,
  getAccountById,
  transferBetweenAccounts,
  withdrawFundsFromAccount,
} from "../service/account";
import {
  getAllTransactions,
  filterAllTransactionsByAccountNumber,
} from "../service/transaction";
import { dealWithError } from "../service/utils";
import { validationResult } from "express-validator";

export class AccountController {
  static async checkIfYouOwnAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const accountNumber: string =
      req.method === "GET" ? req.params.accountNumber : req.body.accountNumber;
    if (!accountNumber || accountNumber.trim() === "") {
      res.status(422).json({ message: "No account number found in the request" });
      return;
    }
    const { userId } = res.locals.userData;

    await new Promise<void>(async (resolve, reject) => {
      try {
        const check = await checkOwner(userId, accountNumber);
        if (check) {
          resolve();
          return next();
        } else {
          reject("You do not own this account");
          return res
            .status(403)
            .json({ message: "You do not own this account" });
        }
      } catch (error) {
        reject(error);
        dealWithError(error, res);
      }
    });
  }

  static async getAccount(req: Request, res: Response) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
    const { id } = req.params;
    const { userId } = res.locals.userData;
    let convId: number;

    convId = Number(id);
    if (Number.isNaN(convId)) {
      res.status(422).json({ message: "Invalid id" });
      return;
    }
    try {
      const check = await confirmAccountAndId(convId, userId);
      if (!check) {
        res.status(403).json({ message: "You do not own this account" });
        return;
      }
      const account = getAccountById(convId);
      res.status(200).json({ message: "Fetch successful", account });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async deleteAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { id } = req.params;
    const { userId } = res.locals.userData;
    let convId: number; //converted id
    convId = Number(id);
    if (Number.isNaN(convId)) {
      res.status(422).json({ message: "Invalid id" });
      return;
    }
    try {
      const check = await confirmAccountAndId(convId, userId);
      if (!check) {
        res.status(403).json({ message: "You do not own this account" });
        return;
      }
      const response = await deleteAccountById(convId);
      if (response === "success")
        res.status(204).json({ message: "Delete successful" });
      else res.status(404).json({ message: "Account not found" });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async createAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { accountName } = req.body;
    try {
      const {
        userId,
      }: {
        userId: number;
      } = res.locals.userData;
      const account = await createWalletAccount(userId, accountName);
      res
        .status(201)
        .json({ message: "Account created successfully", account });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async fundAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { amount, accountNumber } = req.body;
    try {
      const { account, receipt } = await addMoneyToAccount(
        amount,
        accountNumber
      );
      res
        .status(201)
        .json({ message: "Account funded successfully", account, receipt });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async transferFunds(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { accountNumber, to, amount } = req.body;
    try {
      const { account, receipt } = await transferBetweenAccounts(
        accountNumber,
        to,
        amount
      );
      res
        .status(201)
        .json({ message: "Transfer successful", account, receipt });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async withdrawFunds(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { accountNumber, to, amount } = req.body;
    try {
      const { account, receipt } = await withdrawFundsFromAccount(
        accountNumber,
        to,
        amount
      );
      res.status(200).json({
        message: "Successfully withdrawn " + amount,
        account,
        receipt,
      });
    } catch (error) {
      dealWithError(error, res);
    }
  }

  static async getTransactions(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { accountNumber } = req.params;
    try {
      const transactions = await getAllTransactions(accountNumber);
      res.status(200).json({ message: "Fetch successful", transactions });
    } catch (error) {
      dealWithError(error, res);
    }
  }

  static async filterTransactions(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { accountNumber } = req.params;
    const { key, value } = req.query;
    if (!key || !value) {
      res.status(400).json({ message: "Key and value must be present" });
      return;
    }
    try {
      const transactions = await filterAllTransactionsByAccountNumber(key, value, accountNumber);
      res.status(200).json({ message: "Fetch successful", transactions });
    } catch (error) {
      dealWithError(error, res);
    }
  }
}
