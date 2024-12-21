import { Response } from "express";
import CustomError from "../types/customError";

export const generateAccountNumber = (): string =>
  "7" + Math.floor(100000000 + Math.random() * 900000000).toString();

export const dealWithError = (error, res: Response) => {
  if (error instanceof CustomError) {
    res.status(error.code).json({ message: error.message });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  }
};
