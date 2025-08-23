import { Request, Response } from "express";
import { createCategoryLog } from "../utils/logActionAdmin";
import { Category } from "../models/Category";

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ eliminado: false });
    res.json(categories);
  } catch (error) {
    console.log("Error al obtener las categorias", error);
    res.status(500).json({ error: "Error al obtener las categorias" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categories = await Category.findOne({ id });

    res.json(categories);
  } catch (error) {
    console.log("Error al obtener la categoria", error);
    res.status(500).json({ error: "Error al obtener la categoria" });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const lastCategory = await Category.findOne().sort({ id: -1 }).lean();
    const newId = lastCategory ? lastCategory.id + 1 : 1;

    const categories = new Category({
      id: newId,
      category,
    });

    await categories.save();
    if ((req as any).userId) {
      await createCategoryLog(
        (req as any).userId,
        "CREATE_CATEGORY",
        categories.id,
        categories.category
      );
    }
    res
      .status(201)
      .json({ message: "Categoria creada exitosamente", category: categories });
  } catch (error) {
    console.log("Error al crear la categoria", error);
    res.status(500).json({ error: "Error al crear la categoria" });
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { category, estado } = req.body;

    const categories = await Category.findOne({ id: id });

    if (categories) {
      (categories.category = category || categories.category),
        (categories.estado = estado ?? categories.estado);

      await categories.save();
      if ((req as any).userId) {
        await createCategoryLog(
          (req as any).userId,
          "UPDATE_CATEGORY",
          categories.id,
          categories.category
        );
      }

      res.status(201).json({
        message: "Categoria editada exitosamente",
        category: categories,
      });
    } else {
      res.status(404).json({ error: "Categoria no encontrada" });
    }
  } catch (error) {
    console.log("Error al editar la categoria", error);
    res.status(500).json({ error: "Error al editar la categoria" });
  }
};

export const eliminate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categories = await Category.findOne({ id });

    if (!categories) {
      res.status(404).json({ message: "Categoria no encontrada" });
      return;
    }
    if ((req as any).userId) {
      await createCategoryLog(
        (req as any).userId,
        "DELETE_CATEGORY",
        categories.id,
        categories.category
      );
    }
    await Category.findOneAndUpdate({ id }, { eliminado: true }, { new: true });

    res.status(200).json({
      message: "Categoria eliminada exitosamente",
      category: categories,
    });
  } catch (error) {
    console.log("Error al eliminar la categoria", error);
    res.status(500).json({ error: "Error al eliminar la categoria" });
  }
};

export const inhabilitarCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categories = await Category.findOneAndUpdate(
      { id },
      { estado: false },
      { new: true }
    );

    if (!categories) {
      res.status(404).json({ msg: "Categoria no encontrada" });
    }
    if (categories) {
      if ((req as any).userId) {
        await createCategoryLog(
          (req as any).userId,
          "DISABLE_CATEGORY",
          categories.id,
          categories.category
        );
      }
    }
    res.json({ msg: "Categoria inhabilitada", categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const habilitarCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const categories = await Category.findOneAndUpdate(
      { id },
      { estado: true },
      { new: true }
    );
    if (!categories) {
      res.status(404).json({ msg: "Categoria no encontrada" });
    }
    if (categories) {
      if ((req as any).userId) {
        await createCategoryLog(
          (req as any).userId,
          "ENABLE_CATEGORY",
          categories.id,
          categories.category
        );
      }
    }
    res.json({ msg: "Categoria habilitada", categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
