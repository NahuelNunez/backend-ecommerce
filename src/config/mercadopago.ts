import { MercadoPagoConfig } from "mercadopago";
import dotenv from 'dotenv'
dotenv.config();
if(!process.env.MP_ACCESS_TOKEN) {
    throw new Error ("MERCADOPAGO_ACCESS_TOKEN is required")
}

export const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: {
        timeout:5000,
        idempotencyKey:"ecommerce-app",
    },
})