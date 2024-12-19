import AccountModel from "../models/account";
import type { Account } from "../types";
import CustomError from "../types/customError";
import { generateAccountNumber } from "./utils";

const getAccount = async (accountNumber: string): Promise<Account> => {
  const account = await AccountModel.findByAccountNumber(accountNumber);
  if (!account)
    throw new CustomError(14, `Account number ${accountNumber} does not exist`);
  return account;
};

export const createWalletAccount = async (userId: number, accountName: string): Promise<Account> => {
  const accountData: Omit<Account, "id"> = {
    account_name: accountName,
    account_number: generateAccountNumber(),
    balance: 0,
    user_id: userId,
  };
  const account = await AccountModel.create<Omit<Account, "id">, Account>(accountData);
  if (!account) throw new CustomError(500, "Unable to create Account");
  return account;
};

export const addMoneyToAccount = async (
  amount: number,
  accountNumber: string
): Promise<Account> => {
  const account = await getAccount(accountNumber);
  const updated = await AccountModel.updateOneById(account.id, {
    balance: account.balance + amount,
  });
  if (!updated) throw new CustomError(500, "Unable to update Account");
  return updated as Account;
};

export const transferBetweenAccounts = async (
  from: string,
  to: string,
  amount: number
): Promise<Account> => {
  const sender = await getAccount(from);
  if (sender.balance < amount) throw new CustomError(51, "Insufficient funds");
  const recipient = await getAccount(to);
  const updatedSender = await AccountModel.updateOneById(sender.id, {
    balance: sender.balance - amount,
  });
  await AccountModel.updateOneById(recipient.id, {
    balance: recipient.balance + amount,
  });
  return updatedSender as Account;
};

export const withdrawFundsFromAccount = async (
  accountNumber: string,
  to: string,
  amount: number
): Promise<Account> => {
  const account = await getAccount(accountNumber);
  const updatedAccount = await AccountModel.updateOneById(account.id, {
    balance: account.balance - amount,
  });
  // funds withdrawn and sent to the <to> account number
  return updatedAccount as Account;
};
