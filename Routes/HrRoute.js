import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  onChangeLeavesStatus,
  onFetchSpecificCompanyApplyLeaves,
} from "../Controllers/HrController.js";
import { ensureAdmin } from "../Middlewares/HrMiddleware.js";

const router = express.Router();

router.patch(
  "/leaves-status-change/:leaveId",
  authenticateToken,
  CheckingUser,
  ensureAdmin,
  onChangeLeavesStatus
);

router.get(
  "/leaves",
  authenticateToken,
  CheckingUser,
  ensureAdmin,
  onFetchSpecificCompanyApplyLeaves
);

export default router;
