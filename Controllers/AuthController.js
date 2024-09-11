import AuthModel from "../Modals/AuthModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const onRegisterUser = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    empId,
    dateOfBirth,
    role,
    gender,
    companyName,
    termsAndConditions,
  } = req.body;
  const authenticationImage = req.file ? req.file.path : null;
  try {
    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    // const isPasswordValid = bcrypt.compareSync(password, user.password);
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = new AuthModel({
      email,
      password: hashPassword,
      firstName,
      lastName,
      empId,
      dateOfBirth,
      role,
      gender,
      companyName,
      termsAndConditions,
      authenticationImage,
    });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Register user failed" });
  }
};

// login user

export const onLoginUser = async (req, res) => {
  const { empId, password } = req.body;
  try {
    const existingUser = await AuthModel.findOne({ empId });

    if (existingUser) {
      const isPasswordValid = bcrypt.compareSync(
        password,
        existingUser.password
      );
      if (isPasswordValid) {
        const token = jwt.sign(
          { empId: existingUser.empId },
          process.env.JWT_TOKEN_SECRET
          // { expiresIn: "1h" }
        );
        return res.json({ token, message: "Logged in successfully" });
      } else {
        return res.status(400).json({ error: "Invalid password" });
      }
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.log({ error: error.message, message: "Login failed" });
    return res
      .status(400)
      .json({ message: "Login failed..!", error: error.message });
  }
};

export const onGetProfile = async (req, res) => {
  const { user } = req;
  try {
    const profile = await AuthModel.findById(user._id).select(
      "-password -createdAt -updatedAt -__v"
    );
    let location = {};
    if (profile.companyName === "NGS") {
      let longitude = process.env.NLONGITUDE;
      let latitude = process.env.NLALITUDE;

      location = { longitude, latitude };
    } else {
      let longitude = process.env.SDVLONGITUDE;
      let latitude = process.env.SDVLALITUDE;

      location = { longitude, latitude };
    }

    return res.status(200).json({ ...profile.toObject(), location });
  } catch (error) {
    console.log({ error: error.message, message: "profile failed" });
    return res
      .status(500)
      .json({ message: "profile failed", error: error.message });
  }
};

export const onEditProfile = async (req, res) => {
  const { user } = req;
  const { about, dateOfBirth, dateOfJoining, mobile, address } = req.body;
  try {
    // Find the user by id and update the fields specified in the request body
    const updatedProfile = {};
    if (about) updatedProfile.about = about;
    if (dateOfBirth) updatedProfile.dateOfBirth = dateOfBirth;
    if (dateOfJoining) updatedProfile.dateOfJoining = dateOfJoining;
    if (mobile) updatedProfile.mobile = mobile;
    if (address) updatedProfile.address = address;
    // Update the user document with the updated fields
    const updatedUser = await AuthModel.findByIdAndUpdate(
      user._id,
      updatedProfile,
      { new: true }
    ).select("-password -createdAt -updatedAt -__v");
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log({
      error: error.message,
      message: "edit profile change failed",
    });

    return res
      .status(500)
      .json({ message: "edit profile change failed", error: error.message });
  }
};

export const onProfilePicChange = async (req, res) => {
  const { user } = req;
  try {
    const profilePic = req.file;
    if (!profilePic) {
      return res.status(400).json({ error: "No profile picture provided" });
    }

    if (user.profilePic) {
      const oldImagePath = join(__dirname, "..", user.profilePic);

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.log(`Failed to delete old image: ${err}`);
        } else {
          console.log(`Deleted old image: ${user.image}`);
        }
      });
    }

    const updatedUser = await AuthModel.findByIdAndUpdate(
      user._id,
      { profilePic: req.file.path },
      { new: true }
    ).select("-password -createdAt -updatedAt -__v");

    return res.status(200).json({ message: "Updated image successfully" });
  } catch (error) {
    console.log({ error: error.message, message: "onProfilePicChange failed" });
    return res
      .status(500)
      .json({ message: "onProfilePicChange failed", error: error.message });
  }
};

export const onResumeUpload = async (req, res) => {
  const { user } = req;
  try {
    const resume = req.file;
    if (!resume) {
      return res.status(400).json({ error: "No resume provided" });
    }

    if (user.resume) {
      const oldImagePath = join(__dirname, "..", user.resume);

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.log(`Failed to delete old image: ${err}`);
        } else {
          console.log(`Deleted old image: ${user.image}`);
        }
      });
    }

    const updatedUser = await AuthModel.findByIdAndUpdate(
      user._id,
      { resume: req.file.path },
      { new: true }
    ).select("-password -createdAt -updatedAt -__v");
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log({ error: error.message, message: "onResumeUpload failed " });
    return res.status(500).json({ message: "on resumeUpload failed " });
  }
};

export const onForgotPassword = async (req, res) => {
  const { email } = req.body;
  const { user } = req;
  try {
    const existingUser = await AuthModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "forgot password Link send successfully..!" });
  } catch (error) {
    console.log({ error: error.message, message: "onForgotPassword failed " });
    return res.status(500).json({ message: "onForgotPassword failed " });
  }
};

export const onExperienceLetterChange = async (req, res) => {
  const { user } = req; // Assuming `user` is set by `authenticateToken` middleware
  const experienceLetter = req.file?.path; // Path to the uploaded file

  try {
    if (!experienceLetter) {
      return res
        .status(400)
        .json({ error: "No experience letter file provided" });
    }

    const updatedUser = await AuthModel.findByIdAndUpdate(
      user._id,
      { $push: { experinceLetters: experienceLetter } },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Experience letter added", user: updatedUser });
  } catch (error) {
    console.log({
      error: error.message,
      message: "onExperienceLetterChange failed ",
    });
    return res.status(500).json({
      message: "onExperienceLetterChange failed",
      error: error.message,
    });
  }
};
