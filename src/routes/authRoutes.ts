import {Router} from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticateToken } from '../middlewares/auth';
const router = Router();


router.post('/login',authController.login)
router.patch('/changePassword',authenticateToken,authController.changePassword)
export default router
