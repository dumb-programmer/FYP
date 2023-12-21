import express from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

router.get("/signup", signup);

router.get("/login", login);

export default router;
