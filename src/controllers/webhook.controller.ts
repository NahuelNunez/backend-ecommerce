import type { Request, Response } from "express"
import { PaymentService } from "../services/PaymentService"

export class WebhookController {
  private paymentService: PaymentService

  constructor() {
    this.paymentService = new PaymentService()
  }

  handleMercadoPagoWebhook = async (req: Request, res: Response) => {
    try {
      const { type, data } = req.body

      console.log("Webhook received:", { type, data })

      if (type === "payment") {
        const paymentId = data.id

        // Aquí podrías hacer una consulta adicional a la API de MercadoPago
        // para obtener más detalles del pago si es necesario

        // Por ahora, solo confirmamos que recibimos el webhook
        console.log(`Payment webhook received for payment ID: ${paymentId}`)
      }

      // Siempre responder con 200 para confirmar recepción
      res.status(200).send("OK")
    } catch (error) {
      console.error("Error processing webhook:", error)
      res.status(500).send("Error processing webhook")
    }
  }
}
