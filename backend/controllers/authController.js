import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    user.password = undefined;

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// GET PROFILE

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE

export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // OPTIONAL PASSWORD UPDATE
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD BY EMAIL

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};