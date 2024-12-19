export interface AuthRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface createTokenData {
  email: string;
  userId: number;
}

export interface TokenData {
  token: string;
  userId: string;
}

export interface User {
  id: number;
  password: string;
  email: string;
  name: string;
}

export interface Account {
  id: number;
  account_number: string; //unique
  account_name: string; //unique
  balance: number;
  user_id: number;
}

export interface Transaction {
  id: number;
  type: string;
  from: string;
  to: string;
  amount: number;
  account_id: number;
}