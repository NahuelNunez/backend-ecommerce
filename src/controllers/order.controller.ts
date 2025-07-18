import type { Request, Response } from "express"
import { Order } from "../models/Order" // Tu modelo de Order
import { sendOrderEmail } from "../utils/sendOrderEmail" // Tu utilidad de email
import { PaymentService } from "../services/PaymentService" // Importar el servicio de pagos

const paymentService = new PaymentService() // Instanciar el servicio de pagos

export const Create = async (req: Request, res: Response) => {
  try {
    const {
      metodoPago,
      userToken,
      sessionId,
      tipoEntrega,
      nombre, 
      apellido,
      domicilio,
      localidad,
      codigoPostal,
      email,
      telefono,
      montoTotal,
      productos,
      // Campos específicos para transferencia (ahora opcionales)
      numeroTransferencia,
      // Campos específicos para MercadoPago
      paymentExternalReference, // Nueva propiedad para MP
    } = req.body

    // Obtener el filename del comprobante si existe (para transferencia)
    const imagePath = req.file?.filename

    // Validaciones básicas
    if (!metodoPago || !nombre || !apellido || !email || !telefono || !montoTotal || !productos) {
       res.status(400).json({ error: "Faltan campos obligatorios para la orden." })
    }
    if (!productos || productos.length === 0) {
       res.status(400).json({ error: "La orden debe contener al menos un producto." })
    }

    let mercadoPagoDetails = undefined
    let orderEstado = "pendiente" // Estado por defecto

    // Lógica específica para MercadoPago
    if (metodoPago === "mercadoPago-basic" || metodoPago === "tarjeta") {
      if (!paymentExternalReference) {
         res.status(400).json({ error: "paymentExternalReference es requerido para pagos con MercadoPago." })
      }

      // Obtener los detalles del pago desde tu modelo Payment
      const payment = await paymentService.getPaymentStatus(paymentExternalReference)

      if (!payment) {
         res.status(404).json({ error: "Pago no encontrado para la referencia externa proporcionada." })
         return
      }

      mercadoPagoDetails = {
        preferenceId: payment.preferenceId,
        externalReference: payment.externalReference,
        paymentId: payment.paymentId,
        status: payment.status, // Estado del pago en MP
        amount: payment.amount,
      }

      // Si el pago de MP ya está aprobado, la orden puede ir a 'procesando'
      if (payment.status === "approved") {
        orderEstado = "procesando"
      } else if (payment.status === "pending") {
        orderEstado = "pendiente" // O 'esperando_pago'
      } else {
        orderEstado = "cancelada" // O 'rechazada'
      }
    } else if (metodoPago === "transferencia") {
      // Lógica para transferencia bancaria
      if (!numeroTransferencia || !imagePath) {
         res
          .status(400)
          .json({ error: "Número de transferencia y comprobante son requeridos para transferencia bancaria." })
      }
      orderEstado = "pendiente" // Las transferencias suelen ser pendientes hasta verificación manual
    }

    // Generar el ID numérico autoincremental
    const count = await Order.countDocuments()
    const newId = count + 1

    const newOrder = new Order({
      id: newId, // Tu ID numérico
      sessionId,
      userToken,
      metodoPago,
      tipoEntrega,
      nombre,
      apellido,
      domicilio,
      localidad,
      codigoPostal,
      email,
      telefono,
      numeroTransferencia: numeroTransferencia || undefined, // Opcional
      comprobanteURL: imagePath || undefined, // Opcional
      montoTotal,
      productos: JSON.parse(productos), // Asume que productos viene como string JSON
      estado: orderEstado, // Estado de la orden basado en el método de pago
      mercadoPagoDetails: mercadoPagoDetails, // Detalles de MP (será undefined si no es MP)
    })

    await newOrder.save()
    await sendOrderEmail(newOrder) // Envía el email de la orden

    res.status(201).json({
      message: "Orden creada",
      orderId: newOrder.id,
      sessionId: newOrder.sessionId,
      userToken: newOrder.userToken,
      orderData: newOrder, 
    })
  } catch (error) {
    console.error("Error al crear la orden:", error)
    res.status(500).json({ error: "Error al crear la orden" })
  }
}


export const getAll = async (req: Request, res: Response) => {
  try {
    const newOrder = await Order.find()
    res.json(newOrder)
  } catch (error) {
    console.log("Error al obtener las ordenes", error)
    res.status(500).json({ error: "Error al obtener las ordenes" })
  }
}

export const eliminate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const orders = await Order.findOneAndDelete({ id: id })
    if (!orders) {
      res.status(404).json({ error: "Orden no encontrada" })
    }
    res.status(200).json({ message: "Orden eliminada exitosamente", orders })
  } catch (error) {
    console.log("Error al eliminar la orden", error)
    res.status(500).json({ error: "Error al eliminar la orden" })
  }
}

export const getBySessionIdByID = async (req: Request, res: Response) => {
  try {
    const { sessionId, id } = req.params
    const orders = await Order.findOne({ sessionId, id })
    if (!orders) {
      res.status(404).json({ message: "No se encontraron ordenes para esta sesion" })
    }
    res.status(200).json(orders)
  } catch (error) {
    console.log("Error al obtener las ordenes por sessionId", error)
    res.status(500).json({ error: "Error al obtener las ordenes" })
  }
}

export const getByuserTokenWithID = async (req: Request, res: Response) => {
  try {
    const { userToken, id } = req.params
    const orders = await Order.findOne({ userToken, id })
    if (!orders) {
      res.status(404).json({ message: "No se encontraron ordenes para esta sesion" })
    }
    res.status(200).json(orders)
  } catch (error) {
    console.log("Error al obtener las ordenes por sessionId", error)
    res.status(500).json({ error: "Error al obtener las ordenes" })
  }
}
