import { Request, Response } from "express";

const signup = (req: Request, res: Response) => {
  res.json({ message: "Signup" });
};

const login = (req: Request, res: Response) => {
  res.json({ message: "Login" });
};

export { signup, login };
