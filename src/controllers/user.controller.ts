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
        
        const lastUser = await User.findOne().sort({ id: -1 }).lean();
        const newId = lastUser ? lastUser.id + 1 : 1;
          const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            
            id:newId,
            nombre,
            apellido,
            email,
            password:hashedPassword,
            pass:password,
            rol
        })
        await user.save()
        res.status(201).json({message:'Usuario creado exitosamente',user})
    } catch (error) {
      console.error('Error al crear usuario',error)
      res.status(500).json({error:'Error al crear usuario'})
    }
}


export const edit = async(req:Request,res:Response) => {
    try {
     const {id} = req.params
     const {nombre,apellido,email,password,rol} = req.body

     const users = await User.findOne({id})

     if(!users){
        res.status(404).json({error:"Usuario no encontrado"})
     }

     if(users) {
        users.nombre = nombre || users.nombre,
        users.apellido = apellido || users.apellido,
        users.email = email || users.email,
        users.rol = rol || users.rol
     }
     
     if(password && users) {
         const hashedPassword = await bcrypt.hash(password,10)
         users.password = hashedPassword
         
        }

        if(users){

            await users.save();
        }
        

        res.status(200).json({message:"Usuario editado exitosamente",update:users})



    } catch(error) {
        console.log("Error al editar el usuario",error)
        res.status(500).json({error:"Error al editar el usuario"})

    }
}


export const inhabilitarAdmin = async (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    const admin = await User.findOneAndUpdate({id}, { inhabilitado: true }, { new: true });
    if (!admin) {
     res.status(404).json({ msg: 'Administrador no encontrado' });
    }

    res.json({ msg: 'Administrador inhabilitado', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

export const habilitarAdmin = async (req:Request, res:Response) => {
  const { id } = req.params;

  try {
    const admin = await User.findOneAndUpdate({id}, { inhabilitado: false }, { new: true });
    if (!admin) {
       res.status(404).json({ msg: 'Administrador no encontrado' });
    }

    res.json({ msg: 'Administrador habilitado', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

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

