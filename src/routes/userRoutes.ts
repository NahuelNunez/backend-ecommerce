import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth";
const router = Router();

router.get("/getall", userController.getall);

router.post("/create", userController.create);

router.patch("/delete/:id", authenticateToken, userController.destroyer);

router.patch("/edit/:id", authenticateToken, userController.edit);

router.patch(
  "/habilitarAdmin/:id",
  authenticateToken,
  userController.habilitarAdmin
);

router.patch(
  "/inhabilitarAdmin/:id",
  authenticateToken,
  userController.inhabilitarAdmin
);

export default router;
