import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";
import dotenv from 'dotenv'

dotenv.config();




export const cloudinaryConfig = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("✅ Configurate cloudinary");
  } catch (error) {
    throw new Error("❌ It is not possible to connect to Cloudinary");
  }
};


const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file) => ({
    
            folder:"uploads",
            allowed_formats:["jpg", "jpeg", "png", "webp"],
            public_id: `${Date.now()}-${file.originalname}`,
        }),
    });

 



export const upload = multer({ storage });











