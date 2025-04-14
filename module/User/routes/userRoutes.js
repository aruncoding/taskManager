import express from "express";
const router = express.Router();
import UserController from "../controller/userController.js";
import validate from "../../../middlewares/validate.js";
import { userRegistrationRules, userLoginRules } from '../../../validators/userValidator.js'

router.post('/register',userRegistrationRules,validate, UserController.userRegistration)
router.post('/login',userLoginRules,validate, UserController.userLogin)


export default router;