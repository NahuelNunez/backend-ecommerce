import { Request,Response } from "express";
import {Order} from '../models/Order'
import { sendOrderEmail } from "../utils/sendOrderEmail";


export const Create = async(req:Request,res:Response) => {
try {
const {
    metodoPago,
    userToken,
    sessionId,
    tipoEntrega,
    nombreCompleto,
    domicilio,
    localidad,
    codigoPostal,
    email,
    numeroTransferencia,
    montoTotal,
    telefono,
    comprobanteURL,
    productos
} = req.body

const imagePath = req.file?.filename

const count = await Order.countDocuments()

const newOrder = new Order({
    id: count + 1,
    sessionId,
    userToken,
    metodoPago,
    tipoEntrega,
    nombreCompleto,
    domicilio,
    localidad,
    codigoPostal,
    email,
    numeroTransferencia,
    comprobanteURL:imagePath,
    montoTotal,
    telefono,
    productos:JSON.parse(productos)
})
 await newOrder.save();

 await sendOrderEmail(newOrder);
 res.status(201).json({message:'Orden creada',OrderId:newOrder.id , SessionId:newOrder.sessionId,userToken:newOrder.userToken})
} catch (error) {
    console.error('Error al crear la orden',error)
    res.status(500).json({error:'Error al crear la orden'})
}

}

export const getAll = async (req:Request,res:Response) => {
    try { 

const newOrder =  await Order.find()

 res.json(newOrder)


    } catch (error) {
 console.log('Error al obtener las ordenes',error)
 res.status(500).json({error:'Error al obtener las ordenes'})
    }
}

export const eliminate = async(req:Request, res:Response) => {
    try{
   const {id} = req.params

   const orders = await Order.findOneAndDelete({id:id})
 if(!orders) {
    res.status(404).json({error:"Orden no encontrada"})
 }
res.status(200).json({message:"Orden eliminada exitosamente",orders})
    } catch(error) {
     console.log("Error al eliminar la orden",error)
     res.status(500).json({error:"Error al eliminar la orden"})
    }
}

export const getBySessionIdByID = async(req:Request,res:Response) => {

    try {
const {sessionId , id} = req.params;

const orders = await Order.findOne({sessionId,id})

if(!orders ) {
    res.status(404).json({message:"No se encontraron ordenes para esta sesion"})
}
res.status(200).json(orders)
    } catch (error ) {
 console.log("Error al obtener las ordenes por sessionId",error);
 res.status(500).json({error:"Error al obtener las ordenes"})
    }

}

export const getByuserTokenWithID = async(req:Request,res:Response) => {

    try {
const {userToken , id} = req.params;

const orders = await Order.findOne({userToken,id})

if(!orders ) {
    res.status(404).json({message:"No se encontraron ordenes para esta sesion"})
}
res.status(200).json(orders)
    } catch (error ) {
 console.log("Error al obtener las ordenes por sessionId",error);
 res.status(500).json({error:"Error al obtener las ordenes"})
    }

}