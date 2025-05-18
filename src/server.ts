import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
 const {v4:uuidv4} = require('uuid');

const PORT = 3000;
dotenv.config();
const app = express();

app.use(express.json());

app.use(cookieParser())

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

app.get('/api/session',(req,res) => {
  let sessionId = req.cookies.sessionId;
 if(!sessionId) {
 
  sessionId = uuidv4();
  res.cookie("sessionId", sessionId, {
    httpOnly:true,
    secure:true,
    maxAge:1000 * 60 * 60 * 24 * 7,
    sameSite:'lax'
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
  
  app.get("/", (req,res) => {
    res.send("¡Servidor con TypeScript y Express funcionando!");
  })