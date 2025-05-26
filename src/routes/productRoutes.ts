import  {Router} from 'express'
import * as productController from '../controllers/product.controller'
const router = Router();
import { upload } from '../middlewares/upload';
import { authenticateToken } from '../middlewares/auth';
router.get('/getAll',productController.getAll)

router.get('/getAll/:id',productController.getById)

router.post('/create',authenticateToken,upload.single('image'),productController.Create)

router.put('/edite/:id',authenticateToken,upload.single('image'),productController.edit)

router.delete('/delete/:id',authenticateToken,productController.eliminate)

export default router;