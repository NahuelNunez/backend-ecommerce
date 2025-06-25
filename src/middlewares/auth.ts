import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";



export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
     res.status(401).json({ error: "Token no proporcionado" });
     return
  }

  try {
    // Verifica si el token es válido
   const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id:number}
   (req as any ).userId = decoded.id
    next(); // Permitir acceso a la ruta
  } catch (err) {
     res.status(403).json({ error: "Token inválido o expirado" });
  }
};
