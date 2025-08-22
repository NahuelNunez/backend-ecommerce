import { Router } from "express";
import * as productController from "../controllers/product.controller";
const router = Router();
import { upload } from "../middlewares/upload";
import { authenticateToken } from "../middlewares/auth";
router.get("/getAll", productController.getAll);

router.get("/getAll/:id", productController.getById);

router.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  productController.Create
);

router.patch(
  "/edite/:id",
  authenticateToken,
  upload.single("image"),
  productController.edit
);

router.patch("/delete/:id", authenticateToken, productController.eliminate);

router.patch(
  "/inhabilitarProduct/:id",
  authenticateToken,
  productController.inhabilitarProduct
);
router.patch(
  "/habilitarProduct/:id",
  authenticateToken,
  productController.habilitarProduct
);

export default router;
