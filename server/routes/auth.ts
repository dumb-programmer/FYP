import express, { NextFunction, Request, Response } from "express";
import {
  signup,
  login,
  googleCallback,
  authenticateWithGoogle,
  authenticateWithGithub,
  githubCallback,
  getUser,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);
router.post("/logout", logout);

router.get("/user", getUser);

// Google
router.get("/auth/google", authenticateWithGoogle);
router.get("/google/callback", googleCallback);

// Github
router.get("/auth/github", authenticateWithGithub);
router.get("/github/callback", githubCallback);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    (err?.message && err.message.includes("password")) ||
    err.message.includes("user")
  ) {
    res.json(err);
    return;
  }
  next(err);
});

export default router;
