import {Request, Response} from 'express'
import { createCategoryLog } from '../utils/logActionAdmin';
import { Category } from '../models/Category'

export const getAll = async(req:Request,res:Response) => {

    try {
       const categories = await Category.find();
       res.json(categories)
    }
     catch (error) {
        console.log("Error al obtener las categorias",error)
        res.status(500).json({error:"Error al obtener las categorias"})

     }

}

export const getById = async(req:Request,res:Response) => {
    try {

        const {id} = req.params

        const categories = await Category.findOne({id})
        
        res.json(categories)

    } catch(error) {

        console.log("Error al obtener la categoria",error)
        res.status(500).json({error:"Error al obtener la categoria"})

    }
}


export const Create = async(req:Request,res:Response) => {
try {

const {category,estado} = req.body
const count = await Category.countDocuments()

const categories = new Category({
    id: count + 1 ,
    category,
    estado
})



await categories.save()
 if ((req as any).userId) {
      await createCategoryLog((req as any).userId, "CREATE_CATEGORY", categories.id, categories.category)
    }
res.status(201).json({message:"Categoria creada exitosamente",category:categories})

} catch (error) {
    console.log("Error al crear la categoria",error)
    res.status(500).json({error:"Error al crear la categoria"})

}
}

export const edit = async(req:Request,res:Response) => {

    try {
   const {id} = req.params

   const {category,estado} = req.body 

   const categories = await Category.findOne({id:id})

 if(categories) {
    categories.category = category || categories.category ,
    categories.estado = estado || categories.estado

    await categories.save();
    if ((req as any).userId) {
      await createCategoryLog((req as any).userId, "UPDATE_CATEGORY", categories.id, categories.category)
    }

    res.status(201).json({message:"Categoria editada exitosamente",category:categories})
 } else {
    res.status(404).json({error:"Categoria no encontrada"})
 }


    } catch(error) {

        console.log("Error al editar la categoria",error)
        res.status(500).json({error:"Error al editar la categoria"})

    }

}

export const eliminate = async(req:Request,res:Response) => {
    try {
  const {id} = req.params
    
  const categories = await Category.findOne({id})

  if(!categories) {
    res.status(404).json({message: "Categoria no encontrada"})
    return;
  } 
 if ((req as any).userId) {
      await createCategoryLog((req as any).userId, "DELETE_CATEGORY", categories.id, categories.category)
    }
  await Category.findOneAndDelete({id})

  res.status(200).json({message:"Categoria eliminada exitosamente",category:categories})

    } catch(error) {
        console.log("Error al eliminar la categoria",error)
        res.status(500).json({error:"Error al eliminar la categoria"})

    }
}