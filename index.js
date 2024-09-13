import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import mongoose from "mongoose";
import "dotenv/config";

import AuthRoute from "./Routes/AuthRoute.js";
import SuperAdminRoute from "./Routes/SuperAdmin.js";
import AttendanceRoute from "./Routes/AttendanceRoute.js";
import LeavesRoute from "./Routes/LeavesRoute.js";
import HrRoute from "./Routes/HrRoute.js";
import UserModel from "./Modals/AuthModal.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

app.use(express.json());
// app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose
  .connect(process.env.MONGO_DB)
  .then(() =>
    server.listen(process.env.PORT, () =>
      console.log(`App Listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to Exam Server......!" });
});

app.use("/auth", AuthRoute);
app.use("/super-admin", SuperAdminRoute);
app.use("/attendance", AttendanceRoute);

app.use("/leaves", LeavesRoute);
app.use("/hr", HrRoute);

app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

app.patch("/change", async (req, res) => {
  const { company } = req.body;
  try {
    await UserModel.updateMany(
      { companyName: "SDVVL" },
      { companyName: company }
    );
    res.status(200).json({ message: "Company updated successfully" });
  } catch (error) {
    console.log({ message: "cfvgbhjnmkl," });
  }
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    console.log(activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    console.log(data);
    const user = activeUsers.find((user) => user.userId === receiverId);

    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
