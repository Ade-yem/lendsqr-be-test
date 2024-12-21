import AccountModel from "../models/account";
import type { Account, Transaction } from "../types";
import CustomError from "../types/customError";
import { createTransaction } from "./transaction";
import { generateAccountNumber } from "./utils";

type PartialAccount = Partial<Account>;
type WalletTransaction = {
  account: Account;
  receipt: Transaction;
}

const getAccount = async (accountNumber: string): Promise<Account> => {
  if (accountNumber.length !== 10) throw new CustomError(422, `Account number ${accountNumber} is invalid`);
  const account = await AccountModel.findByAccountNumber(accountNumber);
  if (!account)
    throw new CustomError(404, `Account number ${accountNumber} does not exist`);
  return account;
};

export const checkOwner = async (userId:number, accountNumber: string): Promise<boolean>  => {
  const account = await getAccount(accountNumber);
  if (account.user_id === userId) return true;
  else return false;
}

export const getAccountById = async (id: number): Promise<Account> => {
  const account = await AccountModel.findOneById<Account>(id);
  if (!account) throw new CustomError(404, "Account not found");
  return account;
}

export const confirmAccountAndId = async(id: number, userId: number): Promise<boolean> => {
  const account = await getAccountById(id);
  return account.user_id === userId;
}

export const createWalletAccount = async (
  userId: number,
  accountName: string
): Promise<Account> => {
  const accountData: Omit<Account, "id"> = {
    account_name: accountName,
    account_number: generateAccountNumber(),
    balance: 0,
    user_id: userId,
  };
  const account = await AccountModel.create<Omit<Account, "id">, Account>(
    accountData
  );
  if (!account) throw new CustomError(500, "Unable to create Account");
  return account;
};

export const deleteAccountById = async (id: number) => {
  const count = await AccountModel.deleteOneById(id);
  if (count) return "success";
}

export const addMoneyToAccount = async (
  amount: number,
  accountNumber: string
): Promise<WalletTransaction> => {
  const account = await getAccount(accountNumber);
  const updated = await AccountModel.updateOneById<PartialAccount, Account>(
    account.id,
    {
      balance: account.balance + amount,
    }
  );
  const receipt = await createTransaction({
    type: "credit",
    from: "external",
    to: accountNumber,
    amount,
  });
  if (!updated) throw new CustomError(500, "Unable to update Account");
  return {account: updated, receipt};
};

export const transferBetweenAccounts = async (
  from: string,
  to: string,
  amount: number
): Promise<WalletTransaction> => {
  const sender = await getAccount(from);
  if (sender.balance < amount) throw new CustomError(402, "Insufficient funds");
  const recipient = await getAccount(to);
  const updatedSender = await AccountModel.updateOneById<
    PartialAccount,
    Account
  >(sender.id, {
    balance: sender.balance - amount,
  });
  await AccountModel.updateOneById<PartialAccount, Account>(recipient.id, {
    balance: recipient.balance + amount,
  });
  const receipt = await createTransaction({
    type: "transfer",
    from,
    to,
    amount,
  });
  return {account: updatedSender, receipt};
};

export const withdrawFundsFromAccount = async (
  accountNumber: string,
  to: string,
  amount: number
): Promise<WalletTransaction> => {
  const account = await getAccount(accountNumber);
  if (account.balance < amount) throw new CustomError(402, "Insufficient funds");
  const updatedAccount = await AccountModel.updateOneById<
    PartialAccount,
    Account
  >(account.id, {
    balance: account.balance - amount,
  });
  // funds withdrawn and sent to the <to> account number
  const receipt = await createTransaction({
    type: "withdrawal",
    from: accountNumber,
    to,
    amount,
  });
  return {account: updatedAccount, receipt};
};
