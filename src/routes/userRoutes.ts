import { Router } from "express";
import * as userController from '../controllers/user.controller'

const router = Router();

router.get('/getall',userController.getall)

router.post('/create',userController.create)

router.delete('/delete/:id',userController.destroyer)



export default router;
