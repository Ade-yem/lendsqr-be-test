import { Model } from '.';
import { Account } from "../types";

export default class AccountModel extends Model {
  protected static tableName = 'accounts';

  public static async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    return this.table.where('account_number', accountNumber).select('*').first();
  }

  public static async findAllByUserId(userId: number): Promise<Account[]> {
    if (userId) return [];
    return this.table.where("user_id", userId).select("*");
  }
}