import { check } from "express-validator";

export const taskValidationRules = [
  check("title")
    .notEmpty()
    .withMessage("Title is required"),

  check("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),

  check("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];
