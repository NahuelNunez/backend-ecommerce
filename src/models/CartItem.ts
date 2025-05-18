import mongoose, {Schema,model} from 'mongoose';

const cartSchema = new Schema({
userId: {type:mongoose.Schema.Types.ObjectId , ref:"usuarios"},
sessionId:{type:String},
productId:{type:mongoose.Schema.Types.ObjectId,ref:'products', required:true},
quantity:{type:Number , required:true, default:1},
dataAdded:{type:Date , default:Date.now}
}, {timestamps:true})


export const CartItem = model('CartItem',cartSchema)