import { Preference } from "mercadopago"
import { mercadopagoClient } from "../config/mercadopago"

import { v4 as uuidv4 } from "uuid"
import { bdPayment as Payment } from "../models/payment"

interface PaymentItem {
  title: string
  quantity: number
  unit_price: number
  currency_id?: string
}

interface productosPayment {
  idProducto:Number
    titulo: string
    precio: number
    cantidad: number
    imagen: string
}
interface CreatePaymentData {
  items: PaymentItem[]
  userId?: string;
  userEmail:string;
  sessionId?: string;
  formdata: {
    metodoPago: String;
    tipoEntrega: String;
    nombre: String;
    apellido: String;
    domicilio: String;
    localidad: String;
    codigoPostal: String;
    telefono: String;
    email: String;
    productos:productosPayment[]
    envio:String,
   
  }
}

export class PaymentService {
  private preference: Preference

  constructor() {
    this.preference = new Preference(mercadopagoClient)
  }

  async createPaymentPreference(data: CreatePaymentData) {
    try {

      const productosPayment = data.formdata.productos.map((producto) => ({
        idProducto: producto.idProducto,
         titulo: producto.titulo,
    precio: producto.precio,
    cantidad: producto.cantidad,
    imagen: producto.imagen,
      }))
      const externalReference = uuidv4()
      const preferenceData = {
        items: data.items.map((item, idx) => ({
          id: `item-${idx + 1}`,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "ARS",
        })),
        metadata: {
          productos: data.items,
        },
        back_urls: {
          success: `https://backend-ecommerce-xno4.onrender.com/payment/success`,
          failure: `https://backend-ecommerce-xno4.onrender.com/payment/failure`,
         
        },
        auto_return: "approved",
        external_reference: externalReference,
        notification_url: `https://backend-ecommerce-xno4.onrender.com/webhooks/mercadopago`,
      };


      const response = await this.preference.create({ body: preferenceData })


      const totalAmount = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

       const shippingAmount = data.formdata.envio
     const totalAmountandShipping = totalAmount + Number(shippingAmount)


      if (data.userId) {

      console.log("MERCADO USER CONNECTED")
        const payment = new Payment({
          preferenceId: response.id!,
          externalReference,
          amount: totalAmountandShipping,
          status: "pending",
          userId: data.userId,
          userEmail: data.userEmail,
          items: data.items,
          userData: {
           metodoPago:data.formdata.metodoPago,
            tipoEntrega: data.formdata.tipoEntrega,
            nombre: data.formdata.nombre,
            apellido: data.formdata.apellido,
            domicilio: data.formdata.domicilio,
            localidad: data.formdata.localidad,
            codigoPostal: data.formdata.codigoPostal,
            telefono: data.formdata.telefono,
            email: data.formdata.email,
            productos:productosPayment
          
          }


        })

        await payment.save()
        return {
          preferenceId: response.id,
          initPoint: response.init_point,
          sandboxInitPoint: response.sandbox_init_point,
          externalReference,
          amount: totalAmountandShipping,
        }

      } else {
        console.log("MERCADO PAGO CONNECTED")

        const payment = new Payment({
          preferenceId: response.id!,
          externalReference,
          amount: totalAmountandShipping,
          status: "pending",
         
          sessionId: data.sessionId,
          items: data.items,
          userData: {
            metodoPago: data.formdata.metodoPago,
            tipoEntrega: data.formdata.tipoEntrega,
            nombre: data.formdata.nombre,
            apellido: data.formdata.apellido,
            domicilio: data.formdata.domicilio,
            localidad: data.formdata.localidad,
            codigoPostal: data.formdata.codigoPostal,
            telefono: data.formdata.telefono,
            email: data.formdata.email,
            productos:productosPayment
          }
        })

        await payment.save()

        return {
          preferenceId: response.id,
          initPoint: response.init_point,
          sandboxInitPoint: response.sandbox_init_point,
          externalReference,
          amount: totalAmountandShipping,
        }

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
