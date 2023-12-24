import { Request, Response, NextFunction } from "express";

export const asyncHandler = (
  f: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await f(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
