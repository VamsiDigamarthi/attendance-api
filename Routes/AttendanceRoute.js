import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  onGetAttendance,
  onMonthWiseAttendance,
  onPostAttendance,
  onUpdateAttendanceEndTime,
} from "../Controllers/AttendanceController.js";

const router = express.Router();

router.post("/start", authenticateToken, CheckingUser, onPostAttendance);

router.patch(
  "/end-time",
  authenticateToken,
  CheckingUser,
  onUpdateAttendanceEndTime
);

router.get("/", authenticateToken, CheckingUser, onGetAttendance);

router.get(
  "/month-wise",
  authenticateToken,
  CheckingUser,
  onMonthWiseAttendance
);

export default router;
