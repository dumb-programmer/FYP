import express from "express";
import {
  signup,
  login,
  googleCallback,
  authenticateWithGoogle,
} from "../controllers/authController";

const router = express.Router();

router.get("/signup", signup);

router.get("/login", login);

// Google
router.get("/auth/google", authenticateWithGoogle);
router.get("/google/callback", googleCallback);

export default router;
