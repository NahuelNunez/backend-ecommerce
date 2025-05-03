import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
const PORT = 3000;
dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

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