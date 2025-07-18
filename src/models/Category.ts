import { Schema,model } from "mongoose";


const newCategories = new Schema({
    id:{type: Number , required : true},
    category: {type:String, required: true},
    estado:{type:String,required:true}
},{
    timestamps:true
})

newCategories.set('toJSON', {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  });

  export const Category = model('Category',newCategories)
