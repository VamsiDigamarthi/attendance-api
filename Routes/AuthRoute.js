import express from "express";
import {
  onEditProfile,
  onExperienceLetterChange,
  onForgotPassword,
  onGetProfile,
  onLoginUser,
  onProfilePicChange,
  onRegisterUser,
  onResumeUpload,
} from "../Controllers/AuthController.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import upload from "../Middlewares/fileUpload.js";

const router = express.Router();

router.post("/register", upload.single("authenticationImage"), onRegisterUser);

router.post("/login", onLoginUser);

router.get("/profile", authenticateToken, CheckingUser, onGetProfile);

router.patch(
  "/forgot-password",
  authenticateToken,
  CheckingUser,
  onForgotPassword
);

router.patch("/profile-update", authenticateToken, CheckingUser, onEditProfile);

router.patch(
  "/profile-pic",
  authenticateToken,
  CheckingUser,
  upload.single("profilePic"),
  onProfilePicChange
);

router.patch(
  "/resume",
  authenticateToken,
  CheckingUser,
  upload.single("resume"),
  onResumeUpload
);

router.patch(
  "/experience-letters",
  authenticateToken,
  CheckingUser,
  upload.single("experienceLetter"),
  onExperienceLetterChange
);

export default router;
