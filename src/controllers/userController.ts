import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { changeName, getUser, changePassword } from "../service/user";
import CustomError from "../types/customError";

export default class UserController {
  static async getUserData(req: Request, res: Response) {
    try {
      const { email } = res.locals.userData;
      const user = await getUser(email);
      res.status(201).json({ message: "Fetch successful", user });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.code).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  static async updateName(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = res.locals.userData;
    try {
      const user = await changeName(name, id);
      res.status(201).json({ message: "Name changed successfully", user });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.code).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
  static async updatePassword(req: Request, res: Response) {
    const { password, newPassword } = req.body;
    const { id, email } = res.locals.userData;
    try {
      const existing = await getUser(email);
      if (!existing) {
        res.status(422).json({ message: "You do not have an account with us" });
        return;
      }
      if (!bcrypt.compareSync(password, existing.password)) {
        res.status(422).json({ message: "Incorrect password" });
        return;
      }
      const hash = bcrypt.hashSync(newPassword, 10);
      const user = await changePassword(id, hash);
      res.status(201).json({ message: "Password change successful", user });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.code).json({ message: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
