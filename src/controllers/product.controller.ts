
import {Request,Response} from 'express'
import {Product} from '../models/Product'
import { createProductLog } from '../utils/logActionAdmin'
import {v2 as cloudinary} from 'cloudinary'

export const getAll = async (req:Request,res:Response) => {
    try {
     
        const products = await Product.find()
        res.json(products)
      } catch (error) {
        console.error('Error al obtener los productos',error)
        res.status(500).json({error:'Error al obtener los productos'})
      }
}

export const getById = async (req:Request,res:Response) => {
  try {
     const {id} = req.params

     const products = await Product.findOne({id})

     res.json(products)
  } catch(error) { 
    console.error('Error al obtener el producto',error)
    res.status(500).json({error:'Error al obtener el producto'})

  }
}

export const Create = async(req:Request,res:Response) => {



    try {

  
    
  

    const {title,image,price,stock,category} = req.body
    const imagePath = req.file?.path;
const cloudinaryId = req.file?.filename;

console.log("BACKEND POST PRODUCT:",req.file)
    const count = await Product.countDocuments()

    const products = new Product ({
        id: count + 1 ,
        title,
        category,
        image:imagePath,
        cloudinaryId,
        price,
        stock
    })
  
    await products.save()
     if ((req as any).userId) {
      await createProductLog((req as any).userId, "CREATE_PRODUCT", products.id, products.title)
    }
    
    res.status(201).json({message:'Producto creado exitosamente',productos:products })



    } catch (error ) {
  console.error('Error al crear el producto',error)
  res.status(500).json({error:'Error al crear el producto'})

    }
}

export const edit = async(req:Request,res:Response) => { 
 

    try{
      
    
     


    const {id} = req.params
    const {title,price,stock,category} = req.body 
   
     const products = await Product.findOne({id:id})

if (req.file) {
  if (products?.cloudinaryId) {
    await cloudinary.uploader.destroy(products.cloudinaryId)
  }
 
  if(products) {
    products.image = req.file.path;
    products.cloudinaryId = req.file.filename;
  }
  
}



      if(products) {
        products.title = title || products.title ,
        products.category = category || products.category ,
       
        products.price = price || products.price ,
        products.stock = stock || products.stock 

        

        await products.save();

        if ((req as any).userId) {
      await createProductLog((req as any).userId, "UPDATE_PRODUCT", products.id, products.title)
    }
        res.status(201).json({message:'Producto editado correctamente',update:products})
      } else { 
        res.status(404).json({error: 'Producto no encontrado'})
      }
    } catch (error) {
        console.error('Error al editar el producto',error)
        res.status(500).json({error: 'Error al editar el producto'})
    }


}

export const eliminate = async(req:Request, res:Response) => {
 
    try {
   



        const {id} = req.params
        
        const products = await Product.findOne({id:id})
 
        if (!products) {
      res.status(404).json({error:'Producto no encontrado'})
         return;
        }
        if(products.cloudinaryId) {
          await cloudinary.uploader.destroy(products.cloudinaryId);
        }

        if ((req as any).userId) {
      await createProductLog((req as any).userId, "DELETE_PRODUCT", products.id, products.title)
    }

       await Product.findOneAndDelete({ id: Number(id) })

        res.status(200).json({message:'Producto eliminado exitosamente',producto:products})

    } catch (error) {
        console.error('Error al eliminar el producto',error)
        res.status(500).json({error: 'Error al eliminar el producto'})
    }

}
