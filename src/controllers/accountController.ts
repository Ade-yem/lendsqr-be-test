import { Request, Response } from "express";
import {
  addMoneyToAccount,
  createWalletAccount,
  transferBetweenAccounts,
  withdrawFundsFromAccount,
} from "../service/account";
import CustomError from "../types/customError";

export class AccountController {
  static async createAccount(req: Request, res: Response) {
    const {accountName} = req.body;
    try {
      const { id } = res.locals.userData;
      const account = createWalletAccount(accountName, id);
      res
        .status(201)
        .json({ message: "Account created successfully", account });
    } catch (error) {
      const err = error as CustomError;
      res.status(err.code).json({ message: err.message });
    }
  }
  static async fundAccount(req: Request, res: Response) {
    const { amount, accountNumber } = req.body;
    try {
      const account = await addMoneyToAccount(amount, accountNumber);
      res.status(201).json({ message: "Account funded successfully", account });
    } catch (error) {
      const err = error as CustomError;
      res.status(err.code).json({ message: err.message });
    }
  }
  static async transferFunds(req: Request, res: Response) {
    const { from, to, amount } = req.body;
    try {
      const account = await transferBetweenAccounts(from, to, amount);
      res.status(200).json({ message: "Transfer successful", account });
    } catch (error) {
      const err = error as CustomError;
      res.status(err.code).json({ message: err.message });
    }
  }
  static async withdrawFunds(req: Request, res: Response) {
    const {accountNumber, to, amount} = req.body;
    try {
      const account = await withdrawFundsFromAccount(accountNumber, to, amount);
      res.status(200).json({ message: "Successfully withdrawn " + amount, account });
    } catch (error) {
      const err = error as CustomError;
      res.status(err.code).json({ message: err.message });
    }
  }
}
