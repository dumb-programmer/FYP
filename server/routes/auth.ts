import express from "express";
import {
  signup,
  login,
  googleCallback,
  authenticateWithGoogle,
  authenticateWithGithub,
  githubCallback,
} from "../controllers/authController";

const router = express.Router();

router.get("/signup", signup);

router.get("/login", login);

// Google
router.get("/auth/google", authenticateWithGoogle);
router.get("/google/callback", googleCallback);

// Github
router.get("/auth/github", authenticateWithGithub);
router.get("/github/callback", githubCallback);

export default router;
