import TransactionModel from "../models/transactions";
import { Transaction } from "../types";
import CustomError from "../types/customError";

export const createTransaction = async(transactionData: Omit<Transaction, "id">): Promise<Transaction> => {
  const result = await TransactionModel.create<Omit<Transaction, "id">, Transaction>(transactionData);
  if (!result) throw new CustomError(500, "Could not create transaction");
  return result;
}

export const getAllTransactions = async(accountNumber: string): Promise<Transaction[]> => {
  return await TransactionModel.findAllByAccountNumber(accountNumber);
}

export const filterAllTransactionsByAccountNumber = async(key: any, value: any, accountNumber: string): Promise<Transaction[]> => {
  return await TransactionModel.findByKeyValueAndAccountNumber(key, value, accountNumber);
}