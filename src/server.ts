import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes'
import logRoutes from './routes/logRoutes'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import orderRoutes from './routes/orderRoutes'
import categoryRoutes from './routes/categoryRoutes'
import paymentRoutes from './routes/paymentRoutes'
import webhookRoutes from './routes/webhookRoutes'
import * as cloudinary from './middlewares/upload'

import cors from 'cors'
import cookieParser from 'cookie-parser'
 const {v4:uuidv4} = require('uuid');

const PORT = 3000;
dotenv.config();
const app = express();

cloudinary.cloudinaryConfig();


const allowedOrigins = [
  'http://localhost:5173', // desarrollo
  'https://front-end-ecommerce-chelitas.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true
}))

app.use(express.json());

app.use(cookieParser())


app.get('/api/session',(req,res) => {
  let sessionId = req.cookies.sessionId;
 if(!sessionId) {
 
  sessionId = uuidv4();
  res.cookie("sessionId", sessionId, {
    httpOnly:true,
    secure:true,
    maxAge:1000 * 60 * 60 * 24 * 7,
    sameSite:'none'
  })
 }
 res.json({sessionId});
})


mongoose.connect(process.env.MONGO_URI || '')
.then (() => console.log('✅ Conectado a MongoDB Atlas'))
.catch((err) => console.error('❌ Error de conexión:', err))

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
  
 

  app.use('/products',productRoutes)
  app.use('/uploads', express.static('uploads'));

  app.use('/user',userRoutes)
  app.use('/auth',authRoutes)
  app.use('/order',orderRoutes)
  app.use('/category',categoryRoutes)
  app.use("/logs", logRoutes)

  
app.use("/payment", paymentRoutes)
app.use("/webhooks", webhookRoutes)

// Ruta de prueba
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})
  
  app.get("/", (req,res) => {
    res.send("¡Servidor con TypeScript y Express funcionando!");
  })