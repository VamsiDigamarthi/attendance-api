import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  createChat,
  findChat,
  userChats,
} from "../Controllers/ChatController.js";
const router = express.Router();

router.post("/", authenticateToken, CheckingUser, createChat);

router.get("/own-all-chats", authenticateToken, CheckingUser, userChats);

router.get("/find/:receiverId", authenticateToken, CheckingUser, findChat);

export default router;
