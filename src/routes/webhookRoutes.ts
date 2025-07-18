import { Router } from "express"
import { PaymentService } from "../services/PaymentService"

const router = Router()
const paymentService = new PaymentService()

// Webhook de MercadoPago
router.post("/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body

    console.log("Webhook received:", { type, data })

    if (type === "payment") {
      const paymentId = data.id
      console.log(`Payment webhook received for payment ID: ${paymentId}`)

      // Aquí podrías hacer consultas adicionales a MercadoPago si necesitas
      // más información sobre el pago
    }

    res.status(200).send("OK")
  } catch (error) {
    console.error("Error processing webhook:", error)
    res.status(500).send("Error processing webhook")
  }
})

export default router
