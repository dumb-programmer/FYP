import { NextFunction, Request, Response } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.sendStatus(401);
};

export default isAdmin;
