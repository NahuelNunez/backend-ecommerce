import  {Router} from 'express'
import * as productController from '../controllers/product.controller'
const router = Router();
import { upload } from '../middlewares/upload';
router.get('/getAll',productController.getAll)

router.post('/create',upload.single('image'),productController.Create)

router.put('/edite/:id',productController.edit)

router.delete('/delete/:id',productController.eliminate)

export default router;