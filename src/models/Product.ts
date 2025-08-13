import { Schema,model } from "mongoose";


const productSchema = new Schema({
     id:{type:Number , required:true},
    title:{type:String , required:[true,"El titulo es obligatorio"]},
    image:{type:String,required:true},
    category:{type:String,required:true},
    cloudinaryId:{type:String},
     inhabilitado:{type:Boolean, default:false},
    price:{type:Number,required:[true,"El precio es obligatorio"],
        min:0
    },
    stock:{type:Number,required:[true,"El stock es obligaotorio"],
        min:1
    }

},{
    timestamps:true
})

productSchema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  });

export const Product = model('Product',productSchema)