import {Request,Response} from 'express'
import { User } from '../models/User'
import bcrypt from 'bcryptjs'



export const getall = async(req:Request,res:Response) => {
    try {
   const user = await User.find()
   res.status(200).json(user)

    } catch (error) {
        console.error('Error al obtener usuarios ',error)
        res.status(500).json({error:'Error al obtener usuarios'}) 

    }
}

export const create = async(req:Request,res:Response) => {
    
  
    
    try {
      
        
        const {nombre,apellido,email,password,rol} = req.body 
      
        if (!nombre || !apellido || !email || !password || !rol) {
            res.status(400).json({ error: "Todos los campos son obligatorios." });
            return;
          }
            const userExisting = await User.findOne({email})
        if(userExisting) {
            res.status(400).json({error:'El email ya existe'})
            return;
        }
        
          const hashedPassword = await bcrypt.hash(password, 10);
        const count = await User.countDocuments()
        const user = new User({
            
            id:count + 1,
            nombre,
            apellido,
            email,
            password:hashedPassword,
            rol
        })
        await user.save()
        res.status(201).json({message:'Usuario creado exitosamente',user})
    } catch (error) {
      console.error('Error al crear usuario',error)
      res.status(500).json({error:'Error al crear usuario'})
    }
}

export const destroyer =  async(req:Request,res:Response) => {
    
    try { 
 

    const {id} = req.params 
    const user = await User.findOneAndDelete({id:id})
    if(user) {
     res.status(200).json({messsage:'Usuario eliminado exitosamente',user:user});
    } else {
        res.status(404).json({error:'No se encontro el usuario'})
    }

    } catch (error) {
   console.error('Error al eliminar el usuario',error)
   res.status(500).json({error:'Error al eliminar el usuario'})
    }
}