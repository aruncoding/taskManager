import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js";
import AppError from "../../../utils/AppError.js"; // adjust path as needed

const user = db.user;
const task = db.task;

class TaskController {
  static createTask = async (req, res, next) => {
    try {
      const { title, description, status, dueDate } = req.body;

      const userId = req.user?.dataValues?.id;

      const allowedStatuses = ["pending", "in-progress", "completed"];
      if (status && !allowedStatuses.includes(status)) {
        return next(new AppError("Invalid status value", 400));
      }

      const newTask = await task.create({
        title,
        description,
        status: status || "pending",
        dueDate,
        userId,
      });

      res.status(201).json({
        status: 201,
        message: "Task created successfully",
        task: newTask,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserTasks = async (req, res, next) => {
    try {
      const userId = req.user?.dataValues?.id;

      const tasks = await task.findAll({
        where: { userId, isDeleted: false },
      });

      res.status(200).json({
        status: 200,
        message: "Tasks fetched successfully",
        tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  static getTaskById = async (req, res, next) => {
    try {
      const userId = req.user?.dataValues?.id;
      const taskId = req.params.id;

      const taskDetail = await task.findOne({
        where: { id: taskId, userId, isDeleted: false },
      });

      if (!taskDetail) {
        return next(new AppError("Task not found or unauthorized", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Task fetched successfully",
        task: taskDetail,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateTask = async (req, res, next) => {
    try {
      const userId = req.user?.dataValues?.id;
      const taskId = req.params.id;
      const { title, description, status, dueDate } = req.body;

      const taskToUpdate = await task.findOne({
        where: { id: taskId, userId, isDeleted: false },
      });

      if (!taskToUpdate) {
        return next(new AppError("Task not found or unauthorized", 404));
      }

      await taskToUpdate.update({ title, description, status, dueDate });

      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        task: taskToUpdate,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteTask = async (req, res, next) => {
    try {
      const userId = req.user?.dataValues?.id;
      const taskId = req.params.id;

      const taskToDelete = await task.findOne({
        where: { id: taskId, userId, isDeleted: false },
      });

      if (!taskToDelete) {
        return next(new AppError("Task not found or unauthorized", 404));
      }

      await taskToDelete.update({ isDeleted: true });

      res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
