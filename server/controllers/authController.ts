import { NextFunction, Request, Response } from "express";
import passport from "passport";
import {
  githubStrategy,
  googleStrategy,
  localStrategy,
} from "../utils/strategies";
import bcrypt from "bcrypt";
import User from "../models/user";
import { asyncHandler } from "../utils/asyncHandler";
import isAuthenticated from "../middleware/isAuthenticated";
import validateReq from "../middleware/validateReq";
import { LoginSchema, SignupSchema } from "../utils/schema";

passport.use("google", googleStrategy);
passport.use("github", githubStrategy);
passport.use("local", localStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

const authenticateWithGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const authenticateWithGithub = passport.authenticate("github", {
  scope: ["user:email"],
});

const signup = [
  validateReq(SignupSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      res.sendStatus(201);
    } catch (error: any) {
      if (error.code && error.code === 11000) {
        res
          .status(409)
          .json({ message: "A user with this email already exists" });
        return;
      }
      next(error);
    }
  }),
];

const login = [
  validateReq(LoginSchema),
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    return res.json(req.user);
  },
];

const googleCallback = passport.authenticate("google", {
  successRedirect: "http://localhost:5173",
  failureRedirect: "http://localhost:5173",
});

const githubCallback = passport.authenticate("github", {
  successRedirect: "http://localhost:5173",
  failureRedirect: "http://localhost:5173",
});

const getUser = [
  isAuthenticated,
  (req: Request, res: Response) => {
    return res.json(req.user);
  },
];

const logout = [
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  },
];

export {
  signup,
  login,
  logout,
  authenticateWithGoogle,
  googleCallback,
  authenticateWithGithub,
  githubCallback,
  getUser,
};
