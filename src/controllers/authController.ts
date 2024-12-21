import { NextFunction, Request, Response } from "express";
import {
  login,
  createToken,
  register,
} from "../service/auth";
import jwt from "jsonwebtoken";
import { makeKarmaRequest } from "../service/requests";
import { dealWithError } from "../service/utils";
import { validationResult } from 'express-validator';

const secret = process.env.jwt_SECRET as string;

export default class AuthController {
  static async loginUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    try {
      const user = await login({ email, password });
      const token = await createToken({ email, userId: user.id });
      res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      dealWithError(error, res);
    }
  }

  static async registerUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const { email, password, name } = req.body;
    try {
      const response = await makeKarmaRequest(email);
      if (!response) {
        res.status(403).json({message: "You have been blacklisted"});
        return;
      }
      const user = await register({ email, password, name });
      const token = await createToken({ email, userId: user.id });
      res.status(201).json({ message: "Login successful", user, token });
    } catch (error) {
      dealWithError(error, res);
    }
  }

  // middleware
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;
    if (!token || token.trim() === "") {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    await new Promise<void>((resolve, reject) => {
      return jwt.verify(token, secret, (err: any, success: any) => {
        if (err) {
          reject(err);
          return res.status(401).json({ message: "Token expired" });
        } else {
          resolve();
          res.locals.userData = success;
          return next();
        }
      });
    });
  }
}
