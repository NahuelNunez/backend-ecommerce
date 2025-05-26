import {Request,response,Response} from 'express'
import { CartItem } from '../models/CartItem'
import mongoose from 'mongoose';


export const getAll = async(req:Request,res:Response) => {
try {
  const sessionId = req.cookies.sessionId;
  const userId = (req as any).userId || null;

  const filter = userId 
  ? {userId: new mongoose.Types.ObjectId(userId)}
  : {sessionId}
  const cartItems = await CartItem.find(filter).populate("productId")
  res.status(200).json(cartItems)
} catch (error) {
    console.error('Error al obtener los productos del carrito',error)
    res.status(500).json({error:'Error al obtener los productos del carrito'})

}
}

export const create = async (req:Request,res:Response) => {
try {
    const {userId,sessionId,productId,quantity,dataAdded} = req.body
    if(userId) {
        const cartItems = new CartItem({
               userId,
               productId,
               quantity,
               dataAdded
        })
        await cartItems.save();
        res.status(201).json({message:'Producto agregado exitosamente',cartItems})

    } else if (sessionId) {
       const cart = new CartItem({
        sessionId,
        productId,
        quantity,
        dataAdded
       })
       await cart.save()
       res.status(201).json({message:'Producto agregado exitosamente',cart})
    }

} catch (error) {
    console.error('Error al agregar el producto en el carrito',error)
    res.status(500).json({error:'Error al agregar el producto en el carrito'})
}
}

export const eliminateAll = async(req:Request,res:Response) => {
    try {
      
        const TWENTY_DAYS = 20 * 24 * 60 * 60 * 1000;
        const expiridationDate = new Date(Date.now() - TWENTY_DAYS)
        const cartItems = await CartItem.deleteMany({dataAdded:{$1t:expiridationDate}})
        res.status(200).json({message:'Carrito eliminado exitosamente',cartItems}) 
    } catch (error) {
        console.error('Error al eliminar los productos cargados',error)
        res.status(500).json({error:'Error al eliminar los productos cargados'})
    }
}

export const eliminateId = async (req:Request,res:Response) => {
    try {
      const { id } = req.params
      if(!id) {
         res.status(400).json({error:'Id del elemento del carrito no proporcionado'})
      }
      
      const deletedItem = await CartItem.findByIdAndDelete(id)

      if (!deletedItem) {
        res.status(404).json({error:'El elemento no encontrado en el carrito'})
      }
      res.status(200).json({message:'Producto eliminado del carrito exitosamente',deletedItem})
    } catch(error) {
 console.error('Error al eliminar el producto del carrito',error)
 res.status(500).json({error:'Error al eliminar el producto del carrito'})
    }
}
