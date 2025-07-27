
import mongoose, {Schema,model} from "mongoose";

const PaymentSchema = new Schema({
    userId:{
        type:String
    },
    userEmail:{
        type:String
    },
    sessionId:{
        type:String
    },

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
    items:[
        {
            productId:String,
            title:String,
            quantity:Number,
            unit_price:Number,
            

        }
    ],
    userData:{
        metodoPago:String,
          tipoEntrega: String,
  nombre: String,
  apellido:String,
  domicilio: String,
  localidad: String,
  codigoPostal: String,
  telefono: String,
  email: String,
    }
}, {
    timestamps:true,
})

export const bdPayment = model('Payment',PaymentSchema)