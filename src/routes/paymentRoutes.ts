import { Router } from "express"
import { PaymentController } from "../controllers/payment.controller"

const router = Router()
const paymentController = new PaymentController()

// Crear nueva preferencia de pago
router.post("/create", paymentController.createPayment)

// Obtener estado del pago
router.get("/status/:externalReference", paymentController.getPaymentStatus)

// Obtener pagos por usuario
router.get("/user/:userId", paymentController.getUserPayments)

// Obtener pagos por sesión
router.get("/session", paymentController.getSessionPayments)

// URLs de retorno
router.get("/success", paymentController.handleSuccess)
router.get("/failure", paymentController.handleFailure)
router.get("/pending", paymentController.handlePending)

export default router
