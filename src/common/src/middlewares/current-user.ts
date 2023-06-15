import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";


  declare global {
    interface Req extends Request {
        session?: any;
        currentUser?: any;
      }
  }

export const currentUser = (JWT_SECRET_KEY: string) => {
    return (
        req: Req,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.session?.jwt) {
            return next();
          }

        try {
            const payload = jwt.verify(req.session.jwt, JWT_SECRET_KEY!);
            req.currentUser = payload;
        } catch (error) {
            next(error);
        }
        next();
    }
}