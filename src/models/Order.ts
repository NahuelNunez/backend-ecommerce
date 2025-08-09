import {model,Schema} from 'mongoose'





const OrderSchema = new Schema({
  id:{type:Number,required:true},
  userToken:{type:String},
  sessionId:{type:String},
     metodoPago: { type: String, required: true },        
  tipoEntrega: { type: String, required: true },       
  nombre: { type: String, required: true },
  apellido:{type:String, required:true},
  domicilio: { type: String },                         
  localidad: { type: String },
  codigoPostal: { type: Number },
  email: { type: String, required: true },
  telefono:{type:Number, required: true},
  numeroTransferencia: { type: String  },
  comprobanteURL: { type: String  },                    
  estado: { type: String, default: 'No realizada' },       
  fecha: { type: Date, default: Date.now },
  montoTotal:{type:Number, required:true},
  envio:{type:Number},
  productos:[{
    idProducto:{type:Number,required:true},
    titulo:{type:String,required:true},
    precio:{type:Number, required:true},
    cantidad:{type:Number,required:true},
    imagen:{type:String, required:true}
  }],
   mercadoPagoDetails: {
      type: {
        preferenceId: { type: String, required: true },
        externalReference: { type: String, required: true },
        paymentId: { type: String },
        status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], required: true },
        amount: { type: Number, required: true },
      },
      required: false, 
    },
  },{
    timestamps:true
  })

OrderSchema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  });


export const Order = model('Order',OrderSchema)