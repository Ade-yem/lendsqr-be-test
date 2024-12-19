import { Model } from '.';
import { Transaction } from "../types";

export default class TransactionModel extends Model {
  protected static tableName = 'accounts';

  public static async findByAccountNumber(accountNumber: string): Promise<Transaction | null> {
    return this.table.where('account_number', accountNumber).select('*').first();
  }

  public static async findAllByAccountId(accountId: number): Promise<Transaction[]> {
    if (accountId) return [];
    return this.table.where("account_id", accountId).select("*");
  }
}