import { Router } from "express";
import { createFeedback, getAllFeedbacks } from "../controllers/feedbackController";

const router = Router();

router.get("/", getAllFeedbacks);
router.post("/", createFeedback);

export default router;