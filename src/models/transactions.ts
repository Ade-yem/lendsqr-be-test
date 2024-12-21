import { Model } from '.';
import { Transaction } from "../types";

export default class TransactionModel extends Model {
  protected static tableName = 'transactions';

  public static async findAllByAccountNumber(accountNumber: string): Promise<Transaction[]> {
    if (!accountNumber) return [];
    return this.table.where("from", accountNumber).orWhere("to", accountNumber).select("*");
  }

  public static async findBy(key: any, value: any): Promise<Transaction[]> {
    return this.table.where(key, value).select("*");
  }

  public static async findByKeyValueAndAccountNumber(key: any, value: any, accountNumber: string): Promise<Transaction[]> {
    return this.table.where(key, value).andWhere("account_number", accountNumber).select("*");
  }

}