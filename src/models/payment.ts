
import mongoose, {Schema,model} from "mongoose";

const PaymentSchema = new Schema({
    preferenceId:{
        type:String,
        required:true,
        uniqued:true,
    },
    externalReference:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum:["pending","approved","rejected","cancelled"],
        default:"pending",
    },
    amount:{
        type:Number,
        required:true,
    } ,
    paymentId:{
        type:String,
        default:null,
    },
}, {
    timestamps:true,
})

export const Payment = model('Payment',PaymentSchema)