import {Router} from 'express'
import * as orderController from '../controllers/order.controller'
const router = Router()
import { upload } from '../middlewares/upload'

router.post('/create',upload.single('comprobanteURL'),orderController.Create)

router.get('/getall',orderController.getAll)

router.delete('/eliminate/:id',orderController.eliminate)

router.get('/sessionId/:id/:sessionId',orderController.getBySessionIdByID)
router.get("/byRef/:externalReference",orderController.getOrderByExternalReference)

export default router