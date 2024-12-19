import { AuthRequestBody, LoginData, User, createTokenData } from "../types";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import UserModel from "../models/user";
import * as bcrypt from "bcryptjs";
import CustomError from "../types/customError";

config();

export const register = async (data: AuthRequestBody): Promise<User> => {
  const { email, password, name } = data;
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) throw new CustomError(409, "User already exists");
  const userData: Omit<User, "id"> = {
    email,
    password: bcrypt.hashSync(password, 10),
    name,
  };
  const user = (await UserModel.create(userData)) as User;
  return user;
};

export const login = async (data: LoginData): Promise<User> => {
  const { email, password } = data;
  const user = await UserModel.findByEmail(email);
  if (!user) throw new CustomError(401, "User with email not found");
  const comparison = bcrypt.compareSync(password, user.password);
  if (!comparison) throw new CustomError(401, "Invalid password");
  return user;
};

const secret = process.env.jwt_SECRET as string;
const expiration = process.env.jwt_EXPIRES_IN as string;

export const createToken = async (data: createTokenData) => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiration,
  });
  return token;
};
