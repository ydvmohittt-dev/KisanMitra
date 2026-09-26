import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, village, city, state, mobile } = req.body;

    if (!name || !email || !password || !village || !city || !state || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      village,
      city,
      state,
      mobile,
    });

    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
