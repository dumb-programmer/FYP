import { Request, Response } from "express";
import passport from "passport";
import { githubStrategy, googleStrategy } from "../utils/strategies";

passport.use("google", googleStrategy);
passport.use("github", githubStrategy);

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

const signup = (req: Request, res: Response) => {
  res.json({ message: "Signup" });
};

const login = (req: Request, res: Response) => {
  res.json({ message: "Login" });
};

const googleCallback = passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/",
});

const githubCallback = passport.authenticate("github", {
  successRedirect: "/",
  failureRedirect: "/",
});

export {
  signup,
  login,
  authenticateWithGoogle,
  googleCallback,
  authenticateWithGithub,
  githubCallback,
};
