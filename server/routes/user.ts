import { Router } from "express";
import { blockUser, deleteUser, getAllUsers, unblockUser } from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.delete("/:userId", deleteUser);
router.put("/:userId/block", blockUser);
router.put("/:userId/unblock", unblockUser);

export default router;