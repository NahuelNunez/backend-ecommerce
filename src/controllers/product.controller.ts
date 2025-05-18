
import {Request,Response} from 'express'
import {Product} from '../models/Product'

export const getAll = async (req:Request,res:Response) => {
    try {
     
        const products = await Product.find()
        res.json(products)
      } catch (error) {
        console.error('Error al obtener los productos',error)
        res.status(500).json({error:'Error al obtener los productos'})
      }
}

export const Create = async(req:Request,res:Response) => {

    try {

  
    
  

    const {title,image,price,stock,category} = req.body
    const imagePath = req.file?.filename;

    const count = await Product.countDocuments()

    const products = new Product ({
        id: count + 1 ,
        title,
        category,
        image:imagePath,
        price,
        stock
    })

    await products.save()
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
    const image = req.file?.filename 
     const products = await Product.findOne({id:id})

      if(products) {
        products.title = title || products.title ,
        products.category = category || products.category ,
        products.image = image || products.image ,
        products.price = price || products.price ,
        products.stock = stock || products.stock 

         if (image) {
                products.image = `${image}`;
            }

        await products.save();
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
        
        const products = await Product.findOneAndDelete({id:id})
 
        if (!products) {
      res.status(404).json({error:'Producto no encontrado'})

        }

        res.status(200).json({message:'Producto eliminado exitosamente',producto:products})

    } catch (error) {
        console.error('Error al eliminar el producto',error)
        res.status(500).json({error: 'Error al eliminar el producto'})
    }

}
