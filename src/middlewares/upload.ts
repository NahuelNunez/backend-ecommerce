import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary";
import multer from "multer";
import { Request } from "express";
import { FileFilterCallback } from "multer";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req:Request, file:Express.Multer.File) => ({
    
            folder:"uploads",
            allowed_formats:"auto",
            public_id: `${Date.now()}-${file.originalname}`,
        }),
    });

    const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null,true);
        } else {
            cb(new Error('Solo se permiten imagenes y PDF'))
        }
    };


    export const upload = multer({
        storage,
        fileFilter,
      
    })
        













// import multer, { FileFilterCallback } from 'multer';
// import path from 'path';
// import { Request } from 'express';

// // Configuración del almacenamiento
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//         cb(null, uniqueName);
//     }
// });

// // Filtro de archivos para aceptar solo imágenes
// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp','application/pdf'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Solo se permiten archivos de imagen (jpeg, png, jpg, webp)'));
//     }
// };

// export const upload = multer({ 
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
// });