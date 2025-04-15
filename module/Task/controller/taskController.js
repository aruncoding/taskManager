import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js";
import AppError from "../../../utils/AppError.js"; 
import { Op } from 'sequelize';

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

      const { page = 1, limit = 10, status, reminder = false } = req.query;
      const offset = (page - 1) * limit;

      const whereCondition = {
        userId,
        isDeleted: false,
      };

      if (reminder === 'true') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        whereCondition.status = 'pending'; 
        whereCondition.dueDate = {
          [Op.lte]: tomorrow,
        };
      } else if (status) {
       
        whereCondition.status = status;
      }

      const { count, rows: tasks } = await task.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['dueDate', 'ASC']],
      });

      res.status(200).json({
        status: 200,
        message: "Tasks fetched successfully",
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalTasks: count,
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
        status: 200,
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
        status: 200,
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
        status: 200,
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TaskController;
