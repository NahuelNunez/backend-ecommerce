import type { Request, Response } from "express"
import { PaymentService } from "../services/PaymentService"

export class PaymentController {
  private paymentService: PaymentService

  constructor() {
    this.paymentService = new PaymentService()
  }

  createPayment = async (req: Request, res: Response) => {
    try {
      const { items ,formdata , userEmail , userId } = req.body
      const sessionId = req.cookies.sessionId
   

      // Validación básica
      if (!items || items.length === 0) {
         res.status(400).json({
          success: false,
          error: "Items son requeridos",
        })
        return
      }

      // Validar cada item
      for (const item of items) {
        if (!item.title || item.title.trim() === "") {
           res.status(400).json({
            success: false,
            error: "Todos los items deben tener un título",
          })
          return
        }

        if (!item.quantity || item.quantity <= 0) {
           res.status(400).json({
            success: false,
            error: "La cantidad debe ser mayor a 0",
          })
          return
        }

        if (!item.unit_price || item.unit_price <= 0) {
           res.status(400).json({
            success: false,
            error: "El precio debe ser mayor a 0",
          })
          return
        }
      }

      const result = await this.paymentService.createPaymentPreference({
        items,
        userId,
        userEmail,
        sessionId,
   formdata,
      })

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error("Error in createPayment:", error)
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      })
    }
  }

  getPaymentStatus = async (req: Request, res: Response) => {
    try {
      const { externalReference } = req.params

      const payment = await this.paymentService.getPaymentStatus(externalReference)

      if (!payment) {
         res.status(404).json({
          success: false,
          error: "Pago no encontrado",
        })
      }

      res.json({
        success: true,
        data: payment,
      })
    } catch (error) {
      console.error("Error in getPaymentStatus:", error)
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      })
    }
  }

  getUserPayments = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params

      const payments = await this.paymentService.getPaymentsByUser(userId)

      res.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      console.error("Error in getUserPayments:", error)
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      })
    }
  }

  getSessionPayments = async (req: Request, res: Response) => {
    try {
      const sessionId = req.cookies.sessionId

      if (!sessionId) {
         res.status(400).json({
          success: false,
          error: "No hay sesión activa",
        })
      }

      const payments = await this.paymentService.getPaymentsBySession(sessionId)

      res.json({
        success: true,
        data: payments,
      })
    } catch (error) {
      console.error("Error in getSessionPayments:", error)
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      })
    }
  }

  handleSuccess = async (req: Request, res: Response) => {
    try {
      const { external_reference, payment_id } = req.query

   

      if (external_reference && payment_id) {
        await this.paymentService.updatePaymentStatus(external_reference as string, "approved", payment_id as string)
      }

      // Redirigir al frontend
      res.redirect(`http://localhost:5173/payment/success?ref=${external_reference}`)
    } catch (error) {
      console.error("Error in handleSuccess:", error)
      res.redirect(`http://localhost:5173/payment/error`)
    }
  }

  handleFailure = async (req: Request, res: Response) => {
    try {
      const { external_reference } = req.query

      if (external_reference) {
        await this.paymentService.updatePaymentStatus(external_reference as string, "rejected")
      }

      res.redirect(`http://localhost:5173/payment/failure?ref=${external_reference}`)
    } catch (error) {
      console.error("Error in handleFailure:", error)
      res.redirect(`http://localhost:5173/payment/error`)
    }
  }

  handlePending = async (req: Request, res: Response) => {
    try {
      const { external_reference } = req.query

      res.redirect(`http://localhost:5173/payment/pending?ref=${external_reference}`)
    } catch (error) {
      console.error("Error in handlePending:", error)
      res.redirect(`http://localhost:5173/payment/error`)
    }
  }
}
