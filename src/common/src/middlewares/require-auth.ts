import {Request, Response, NextFunction} from "express";

export const RequireAuth =async (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) return next(new Error("not authorized"));

    next();
}