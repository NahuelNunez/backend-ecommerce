import { Router, type Request, type Response } from "express"
import { getAllLogs } from "../utils/logActionAdmin"
import { User } from "../models/User"
import { authenticateToken } from "../middlewares/auth"

const router = Router()

// Aplicar autenticación
router.use(authenticateToken)

/**
 * Ver logs (solo superadmin)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Verificar que sea superadmin
    const userId = (req as any).userId
    const user = await User.findOne({ id: userId })

    if (!user || user.rol !== "superadmin") {
       res.status(403).json({
        error: "Solo el superadmin puede ver los logs",
      })
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20

    const result = await getAllLogs(page, limit)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error al obtener logs:", error)
    res.status(500).json({
      error: "Error al obtener logs",
    })
  }
})

export default router
