import { Log } from "../models/Log"
import { User } from "../models/User"

/**
 * Crear log para productos
 */
export const createProductLog = async (
  userId: number,
  action: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT" | "ENABLE_PRODUCT" | "DISABLE_PRODUCT",
  productId: number,
  productTitle: string,
) => {
  await createLog(userId, action, productId, productTitle, "producto")
}

/**
 * Crear log para categorías
 */
export const createCategoryLog = async (
  userId: number,
  action: "CREATE_CATEGORY" | "UPDATE_CATEGORY" | "DELETE_CATEGORY" | "ENABLE_CATEGORY" | "DISABLE_CATEGORY",
  categoryId: number,
  categoryName: string,
) => {
  await createLog(userId, action, categoryId, categoryName, "categoría")
}

/**
 * Función general para crear logs
 */
const createLog = async (
  userId: number,
  action: string,
  resourceId: number,
  resourceName: string,
  resourceType: string, // "producto" o "categoría"
) => {
  try {
    // 1. Buscar usuario
    const user = await User.findOne({ id: userId })
    if (!user) {
      console.log(`⚠️ Usuario no encontrado: ${userId}`)
      return
    }

    // 2. Crear descripción
    let actionText = ""
    switch (action) {
      case "CREATE_PRODUCT":
      case "CREATE_CATEGORY":
        actionText = "creó"
        break
      case "UPDATE_PRODUCT":
      case "UPDATE_CATEGORY":
        actionText = "editó"
        break
      case "DELETE_PRODUCT":
      case "DELETE_CATEGORY":
        actionText = "eliminó"
        break
        case "ENABLE_PRODUCT":
          case "ENABLE_CATEGORY":
            actionText = "desahibilito"
            break
        case "DISABLE_PRODUCT":
          case "DISABLE_CATEGORY":
            actionText = "habilito"    
            break
    }

    const description = `${user.nombre} ${user.apellido} ${actionText} la ${resourceType} "${resourceName}"`

    // 3. Generar ID
    const count = await Log.countDocuments()
    const newId = count + 1

    // 4. Crear log
    const log = new Log({
      id: newId,
      userId,
      action,
      resourceId,
      resourceName,
      description,
    })

    await log.save()
    console.log(`✅ Log creado: ${description}`)
  } catch (error) {
    console.error("❌ Error al crear log:", error)
  }
}

/**
 * Obtener todos los logs
 */
export const getAllLogs = async (page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      Log.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Log.countDocuments(),
    ])

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error al obtener logs:", error)
    return { logs: [], pagination: { page: 1, limit, total: 0, pages: 0 } }
  }
}
