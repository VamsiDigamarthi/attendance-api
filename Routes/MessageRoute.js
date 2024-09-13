import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { addMessage, getMessages } from "../Controllers/MessageController.js";
const router = express.Router();

router.post("/", authenticateToken, CheckingUser, addMessage);

router.get("/:chatId", authenticateToken, CheckingUser, getMessages);

export default router;
