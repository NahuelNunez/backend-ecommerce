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
        res.status(401).json({error:"Credenciales incorrectas"});
        return;
     }
     const token = jwt.sign({
        id: user!.id , email: user!.email , rol: user!.rol
     }, process.env.JWT_SECRET as string,{expiresIn : "1h"})

    res.json({message:'Login exitoso',token,name:user.nombre,rol:user.rol,apellido:user.apellido,email:user.email
    })
    } catch (error) {
        console.error('Error en el servidor',error)
        res.status(500).json({error:"Error en el servidor"})
    }
}

export const changePassword = async(req:Request,res:Response) => {
   const {actual,nueva} =req.body;

   if (!actual || !nueva) {
      res.status(400).json({error: "Faltan datos."})
      return;
   }
   try{
      const userId = (req as any).userId;

      const user = await User.findOneAndUpdate({id:userId});

      if (!user) {
         
          res.status(404).json({error:"Usuario no encontrado."})
         return;
      }
         const isMatch = await bcrypt.compare(actual,user.password);

         if(!isMatch) 
         {
             res.status(400).json({error: "La contraseña actual es incorrecta."})
             return;
         }
         const nuevaHash= await bcrypt.hash(nueva,10);
      
         await User.findOneAndUpdate (
           { id:userId},
            {password:nuevaHash}
         )
         res.json({message:"Contraseña actualizada correctamente."})


   } catch(error) {
      console.log(error);
      res.status(500).json({error:"Error en el servidor"})
   }
}