import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";

import AuthRoute from "./Routes/AuthRoute.js";
import SuperAdminRoute from "./Routes/SuperAdmin.js";
import AttendanceRoute from "./Routes/AttendanceRoute.js";
import LeavesRoute from "./Routes/LeavesRoute.js";
import HrRoute from "./Routes/HrRoute.js";

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
