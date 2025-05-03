import { Request,Response } from "express"
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import {User} from '../models/User'
export const login = async(req:Request,res:Response,) => {
    try {
        const {email,password} = req.body;
     if(!email || !password) {
        res.status(400).json({error:"Email y contraseña son requeridos"});
        return;
     }
     const user = await User.findOne({email:email});
     if(!user){ 
        res.status(401).json({error:"Email incorrecto"});
        return
     }
     
     const isMatch = await bcrypt.compare(password,user!.password);
     if (!isMatch) {
        res.status(401).json({error:"Credenciales incorrectas boludoo"});
        return;
     }
     const token = jwt.sign({
        id: user!.id , email: user!.email , rol: user!.rol
     }, process.env.JWT_SECRET as string,{expiresIn : "1h"})

    res.json({message:'Login exitoso',token})
    } catch (error) {
        console.error('Error en el servidor',error)
        res.status(500).json({error:"Error en el servidor"})
    }
}