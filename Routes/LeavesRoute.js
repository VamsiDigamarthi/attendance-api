import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { onApplyLeaves, onGetLeaves } from "../Controllers/LeavesController.js";
import upload from "../Middlewares/fileUpload.js";

const router = express.Router();

router.post(
  "/apply",
  authenticateToken,
  CheckingUser,
  upload.single("documente"),
  onApplyLeaves
);

router.get("/", authenticateToken, CheckingUser, onGetLeaves);

export default router;
