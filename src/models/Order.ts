import {model,Schema} from 'mongoose'





const OrderSchema = new Schema({
  id:{type:Number,required:true},
  userToken:{type:String},
  sessionId:{type:String},
     metodoPago: { type: String, required: true },        
  tipoEntrega: { type: String, required: true },       
  nombreCompleto: { type: String, required: true },
  domicilio: { type: String },                         
  localidad: { type: String },
  codigoPostal: { type: Number },
  email: { type: String, required: true },
  telefono:{type:Number, required: true},
  numeroTransferencia: { type: String , required:true },
  comprobanteURL: { type: String , required:true },                    
  estado: { type: String, default: 'pendiente' },       
  fecha: { type: Date, default: Date.now },
  montoTotal:{type:Number, required:true},
  productos:[{
    idProducto:{type:Number,required:true},
    titulo:{type:String,required:true},
    precio:{type:Number, required:true},
    cantidad:{type:Number,required:true},
    imagen:{type:String, required:true}
  }],
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