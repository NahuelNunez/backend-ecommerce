import {Router} from 'express'
import * as categoryController from '../controllers/category.controller'
const router = Router();
import { authenticateToken } from '../middlewares/auth';

router.get('/getAll',categoryController.getAll)
router.get('/getAll/:id',authenticateToken,categoryController.getById)
router.post('/create',authenticateToken,categoryController.Create)
router.put('/edit/:id',authenticateToken,categoryController.edit)
router.delete('/delete/:id',authenticateToken,categoryController.eliminate)

export default router;