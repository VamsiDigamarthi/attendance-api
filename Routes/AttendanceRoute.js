import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  onGetAttendance,
  onGetAttendanceByDate,
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
  "/month-wise/:year/:month",
  authenticateToken,
  CheckingUser,
  onMonthWiseAttendance
);

router.get(
  "/status/:date",
  authenticateToken,
  CheckingUser,
  onGetAttendanceByDate
);

export default router;
