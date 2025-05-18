import { Router } from "express";
import * as userController from '../controllers/user.controller'
import { authenticateToken } from '../middlewares/auth';
const router = Router();

router.get('/getall',userController.getall)

router.post('/create',userController.create)

router.delete('/delete/:id',authenticateToken,userController.destroyer)



export default router;
