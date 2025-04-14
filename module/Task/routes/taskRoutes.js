import express from "express";
const router = express.Router();
import TaskController from "../controller/taskController.js";
import checkUserAuth from "../../../middlewares/auth-middleware.js";
import validate from "../../../middlewares/validate.js";
import { taskValidationRules } from '../../../validators/taskValidation.js'

router.post('/create',taskValidationRules,validate,checkUserAuth, TaskController.createTask)
router.get('/getalltask',checkUserAuth, TaskController.getUserTasks)
router.get('/gettaskbyid/:id',checkUserAuth, TaskController.getTaskById)
router.put('/edittask/:id',checkUserAuth, TaskController.updateTask)
router.delete('/deletetask/:id',checkUserAuth, TaskController.deleteTask)


export default router;