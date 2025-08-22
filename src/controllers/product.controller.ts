import { Request, Response } from "express";
import { Product } from "../models/Product";
import { createProductLog } from "../utils/logActionAdmin";
import { v2 as cloudinary } from "cloudinary";

export const getAll = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ eliminado: false });
    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const products = await Product.findOne({ id });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener el producto", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    const { title, image, price, stock, category } = req.body;
    const imagePath = req.file?.path;
    const cloudinaryId = req.file?.filename;

    const lastProduct = await Product.findOne().sort({ id: -1 }).lean();
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const products = new Product({
      id: newId,
      title,
      category,
      image: imagePath,
      cloudinaryId,
      price,
      stock,
    });

    await products.save();
    if ((req as any).userId) {
      await createProductLog(
        (req as any).userId,
        "CREATE_PRODUCT",
        products.id,
        products.title
      );
    }

    res
      .status(201)
      .json({ message: "Producto creado exitosamente", productos: products });
  } catch (error) {
    console.error("Error al crear el producto", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price, stock, image, category } = req.body;

    const products = await Product.findOne({ id: id });

    if (req.file && products) {
      if (products.cloudinaryId) {
        await cloudinary.uploader.destroy(products.cloudinaryId);
      }

      products.image = req.file.path;
      products.cloudinaryId = req.file.filename;
    }

    if (products) {
      (products.title = title || products.title),
        (products.category = category || products.category),
        (products.image = req.file?.path || products.image),
        (products.price = price || products.price),
        (products.stock = stock || products.stock);

      await products.save();

      if ((req as any).userId) {
        await createProductLog(
          (req as any).userId,
          "UPDATE_PRODUCT",
          products.id,
          products.title
        );
      }
      res
        .status(201)
        .json({ message: "Producto editado correctamente", update: products });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al editar el producto", error);
    res.status(500).json({ error: "Error al editar el producto" });
  }
};

export const eliminate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const products = await Product.findOne({ id: id });

    if (!products) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    if (products.cloudinaryId) {
      await cloudinary.uploader.destroy(products.cloudinaryId);
    }

    if ((req as any).userId) {
      await createProductLog(
        (req as any).userId,
        "DELETE_PRODUCT",
        products.id,
        products.title
      );
    }

    await Product.findOneAndUpdate(
      { id: id },
      { eliminado: true },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Producto eliminado exitosamente", producto: products });
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

export const inhabilitarProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndUpdate(
      { id },
      { inhabilitado: true },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
    if (product) {
      if ((req as any).userId) {
        await createProductLog(
          (req as any).userId,
          "DISABLE_PRODUCT",
          product.id,
          product.title
        );
      }
    }
    res.json({ msg: "Producto inhabilitado", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const habilitarProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndUpdate(
      { id },
      { inhabilitado: false },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
    if (product) {
      if ((req as any).userId) {
        await createProductLog(
          (req as any).userId,
          "ENABLE_PRODUCT",
          product.id,
          product.title
        );
      }
    }
    res.json({ msg: "Producto habilitado", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
