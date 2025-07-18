import { Preference } from "mercadopago"
import { mercadopagoClient } from "../config/mercadopago"

import { v4 as uuidv4 } from "uuid"
import { Payment } from "../models/payment"

interface PaymentItem {
  title: string
  quantity: number
  unit_price: number
  currency_id?: string
}

interface CreatePaymentData {
  items: PaymentItem[]
  userId?: string
  sessionId?: string
}

export class PaymentService {
  private preference: Preference

  constructor() {
    this.preference = new Preference(mercadopagoClient)
  }

  async createPaymentPreference(data: CreatePaymentData) {
    try {
      const externalReference = uuidv4()
const preferenceData = {
  items: data.items.map((item, idx) => ({
    id: `item-${idx + 1}`,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_id:  "ARS",
  })),
  back_urls: {
    success: `https://giant-badgers-greet.loca.lt/payment/success`,
    failure: `https://giant-badgers-greet.loca.lt/payment/failure`,
    pending: `https://giant-badgers-greet.loca.lt/payment/pending`,
  },
  auto_return: "approved",
  external_reference: externalReference,
  notification_url: `https://giant-badgers-greet.loca.lt/webhooks/mercadopago`,
};


      const response = await this.preference.create({ body: preferenceData })

  
      const totalAmount = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  
      const payment = new Payment({
        preferenceId: response.id!,
        externalReference,
        amount: totalAmount,
        status: "pending",
        userId: data.userId,
        sessionId: data.sessionId,
      })

      await payment.save()

      return {
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point,
        externalReference,
        amount: totalAmount,
      }
    } catch (error) {
      console.error("Error creating payment preference:", error)
      throw new Error("Error al crear la preferencia de pago")
    }
  }

  async getPaymentStatus(externalReference: string) {
    try {
      const payment = await Payment.findOne({ externalReference })
      return payment
    } catch (error) {
      console.error("Error getting payment status:", error)
      throw new Error("Error al obtener el estado del pago")
    }
  }

  async updatePaymentStatus(
    externalReference: string,
    status: "approved" | "rejected" | "cancelled",
    paymentId?: string,
  ) {
    try {
      const payment = await Payment.findOneAndUpdate(
        { externalReference },
        {
          status,
          paymentId: paymentId || undefined,
        },
        { new: true },
      )

      return payment
    } catch (error) {
      console.error("Error updating payment status:", error)
      throw new Error("Error al actualizar el estado del pago")
    }
  }

  async getPaymentsByUser(userId: string) {
    try {
      const payments = await Payment.find({ userId }).sort({ createdAt: -1 })
      return payments
    } catch (error) {
      console.error("Error getting user payments:", error)
      throw new Error("Error al obtener los pagos del usuario")
    }
  }

  async getPaymentsBySession(sessionId: string) {
    try {
      const payments = await Payment.find({ sessionId }).sort({ createdAt: -1 })
      return payments
    } catch (error) {
      console.error("Error getting session payments:", error)
      throw new Error("Error al obtener los pagos de la sesión")
    }
  }
}
