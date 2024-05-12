import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  return res.sendStatus(401);
};

export default isAuthenticated;
