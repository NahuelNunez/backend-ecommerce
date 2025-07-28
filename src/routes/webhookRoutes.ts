import { Request, Response, Router } from "express"
import { PaymentService } from "../services/PaymentService"
import MercadoPagoConfig, { Payment } from "mercadopago"
import { mercadopagoClient } from "../config/mercadopago"
import { bdPayment } from "../models/payment" 
import { Order } from "../models/Order"
import { sendOrderEmail } from "../utils/sendOrderEmail"
const router = Router()
const paymentService = new PaymentService()

// Webhook de MercadoPago
router.post("/mercadopago", async (req:Request, res:Response) => {
  try {
    const { type, data } = req.body
    
    console.log("Webhook received:", { type, data })
    
    const paymentId = data.id
    // if (type === "payment") {
      //   const paymentId = data.id
      //   console.log(`Payment webhook received for payment ID: ${paymentId}`)
      
      
      // }
      const body: {data: {id: string}} = req.body;

  // Obtenemos el pago
  const MPpayment = await new Payment(mercadopagoClient).get({id: body.data.id});

  
 

   const payment = await bdPayment.findOne({externalReference:MPpayment.external_reference})
  if (!payment) {
     res.sendStatus(404)
     return;
  }
  if(MPpayment.status === "approved") {
      payment.status = "approved"
      payment.paymentId = paymentId
      await payment.save();
  }

   const existingOrder = await Order.findOne({ 'mercadoPagoDetails.payment_id': paymentId });
   console.log("Buscando payment en BD:", MPpayment.external_reference)
console.log("Payment encontrado:", payment)
console.log("Estado MP:", MPpayment.status)
console.log("Ya existe order?", existingOrder)
    if (MPpayment.status === "approved" && !existingOrder) {
      // Crear orden

      const  mercadoPagoDetails = {
        preferenceId: payment.preferenceId,
        externalReference: payment.externalReference,
        paymentId: payment.paymentId,
        status: payment.status, // Estado del pago en MP
        amount: payment.amount,
      }
      const count = await Order.countDocuments()
      const newId = count + 1 
      if (payment.userId) {

      const newOrder = await Order.create({
        id: newId,
        mercadoPagoDetails:mercadoPagoDetails,
        metodoPago: payment.userData?.metodoPago,
        tipoEntrega:payment.userData?.tipoEntrega,
        codigoPostal:payment.userData?.codigoPostal,
        nombre:payment.userData?.nombre,
        apellido:payment.userData?.apellido,
        domicilio:payment.userData?.domicilio,
        localidad:payment.userData?.localidad,
        telefono:payment.userData?.telefono,
        email:payment.userData?.email,
        montoTotal:payment.amount,
        productos: payment.userData?.productos,
        estado:"aprobado",
      });

      // Enviar mail
      await sendOrderEmail(newOrder);
    } else  {
         const newOrder = await Order.create({
        id: newId,
        mercadoPagoDetails:mercadoPagoDetails,
        metodoPago: payment.userData?.metodoPago,
        tipoEntrega:payment.userData?.tipoEntrega,
        nombre:payment.userData?.nombre,
        apellido:payment.userData?.apellido,
        domicilio:payment.userData?.domicilio,
        localidad:payment.userData?.localidad,
        telefono:payment.userData?.telefono,
        email:payment.userData?.email,
        montoTotal:payment.amount,
        productos: payment.userData?.productos,
        estado:"aprobado"
      });
      
      await sendOrderEmail(newOrder);
    }

    res.sendStatus(200);
  }


    res.status(200).send("OK")
  } catch (error) {
    console.error("Error processing webhook:", error)
    res.status(500).send("Error processing webhook")
  }
})

export default router
