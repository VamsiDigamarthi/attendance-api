import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { onChangeLeavesStatus } from "../Controllers/HrController.js";

const router = express.Router();

router.patch(
  "/leaves-status-change/:leaveId",
  authenticateToken,
  CheckingUser,
  onChangeLeavesStatus
);

export default router;
