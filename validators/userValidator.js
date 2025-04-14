// validators/userValidator.js
import { check } from "express-validator";

export const userRegistrationRules = [
  check("Name").notEmpty().withMessage("Name is required"),
  check("Email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("cPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  })
];

export const userLoginRules = [
    check("Email").isEmail().withMessage("Valid email is required"),
    check("Password").notEmpty().withMessage("Password is required"),
  ];
