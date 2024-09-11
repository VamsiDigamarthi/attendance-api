import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    dateOfJoining: {
      type: String,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Employee"],
      default: "Employee",
    },
    isApprovated: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    termsAndConditions: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
    resume: {
      type: String,
    },
    authenticationImage: {
      type: String,
    },
    experinceLetters: {
      type: [String], // Array of strings
      default: [],
    },
    permissions: {
      read: { type: Boolean, default: false },
      write: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
