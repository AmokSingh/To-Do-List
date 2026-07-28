import express from "express";
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Use environment variable with fallback
const JWT_SECRET = process.env.JWT_SECRET_KEY || "fallback_dev_secret_12345";

console.log("🔐 Auth JWT_SECRET:", JWT_SECRET.substring(0, 10) + "..."); // Debug

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const field = existingUser.username === username ? "Username" : "Email";
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("✅ Login successful for:", user.email); // Debug
    console.log("🔑 Token generated:", token.substring(0, 20) + "..."); // Debug

    // Send response with token
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

export { router as authRouter };
