import { Request, Response } from "express";
import passport from "passport";
import { googleStrategy } from "../utils/strategies";

passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

const authenticateWithGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const signup = (req: Request, res: Response) => {
  res.json({ message: "Signup" });
};

const login = (req: Request, res: Response) => {
  res.json({ message: "Login" });
};

const googleCallback = [
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
];

export { signup, login, authenticateWithGoogle, googleCallback };
