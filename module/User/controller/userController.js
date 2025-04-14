import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js";
import AppError from "../../../utils/AppError.js"; // adjust path as needed

const user = db.user;

class UserController {
  // Register a new user
  static userRegistration = async (req, res, next) => {
    try {
      const { Name, Email, password } = req.body;

      // Check if user already exists
      const existingUser = await user.findOne({
        where: { userEmail: Email, isDeleted: false },
      });

      if (existingUser) {
        return next(new AppError("Email already exists", 409)); // Conflict
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = await user.create({
        userName: Name,
        userEmail: Email,
        userPassword: hashPassword,
      });

      if (!newUser || !newUser.id) {
        return next(new AppError("Failed to create user", 500));
      }

      // Generate JWT Token
      const token = jwt.sign(
        { UserId: newUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(201).json({
        status: 201,
        message: "Registration successful!",
        token,
        userDetails: newUser,
      });
    } catch (error) {
      next(error); // Pass error to error handler
    }
  };

  // Login existing user
  static userLogin = async (req, res, next) => {
    try {
      const { Email, Password } = req.body;

      const foundUser = await user.findOne({
        where: { userEmail: Email, isDeleted: false },
      });

      if (!foundUser) {
        return next(new AppError("User not registered", 404));
      }

      const isMatch = await bcrypt.compare(Password, foundUser.userPassword);

      if (!isMatch) {
        return next(new AppError("Invalid credentials", 401));
      }

      const token = jwt.sign(
        { UserId: foundUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 200,
        message: "Login successful",
        token,
        userDetail: foundUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
