import { Model } from '.';
import { User } from '../types';

export default class UserModel extends Model {
  protected static tableName = 'users';

  public static async findByEmail(email: string): Promise<User | null> {
    try {
      return this.table.where('email', email).select('*').first();
    } catch (error) {
      return null;
    }
  }
}