import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { changeName, getUser, changePassword } from "../service/user";
import { dealWithError } from "../service/utils";
import { validationResult } from "express-validator";

export default class UserController {
  static async getUserData(req: Request, res: Response) {
    try {
      const { email } = res.locals.userData;
      const user = await getUser(email);
      res.status(201).json({ message: "Fetch successful", user });
    } catch (error) {
      dealWithError(error, res);
    }
  }

  static async updateName(req: Request, res: Response) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(422).json({ errors: errors.array() });
          return;
        }
    const { name } = req.body;
    const { userId } = res.locals.userData;
    try {
      const user = await changeName(name, userId);
      res.status(201).json({ message: "Name changed successfully", user });
    } catch (error) {
      dealWithError(error, res);
    }
  }
  static async updatePassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { password, newPassword } = req.body;
    const { userId, email } = res.locals.userData;
    try {
      const existing = await getUser(email);
      if (!existing) {
        res.status(422).json({ message: "You do not have an account with us" });
      } else {
        if (bcrypt.compareSync(password, existing.password)) {
          const hash = bcrypt.hashSync(newPassword, 10);
          const user = await changePassword(userId, hash);
          res.status(201).json({ message: "Password change successful", user });
        } else {
          res.status(403).json({ message: "Incorrect password" });
        }
      }
    } catch (error) {
      dealWithError(error, res);
    }
  }
}
