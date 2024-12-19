import UserModel from "../models/user";
import { User } from "../types";
import CustomError from "../types/customError";

export const getUser = async (email: string): Promise<User> => {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new CustomError(404, "User not found");
  return user;
};

export const changeName = async (name: string, id: number): Promise<User> => {
  const user = await UserModel.updateOneById<Omit<User, "id" | "password" | "email">, User>(id, { name });
  if (!user) throw new CustomError(500, "Could not update user");
  return user;
};

export const changePassword = async (id: number, password: string): Promise<User> => {
  const user = await UserModel.updateOneById<Omit<User, "id" | "name" | "email">, User>(id, { password });
  if (!user) throw new CustomError(500, "Could not update user");
  return user;
};
