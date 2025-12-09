import { Router } from "express";
import ProductController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

// VALIDADORES
import { createProductValidator, updateProductValidator } from "../validators/productValidator";
import validationMiddleware from "../middleware/validationMiddleware";

const productRouter = Router();
productRouter.post("/", authMiddleware, upload.single("image"), ProductController.addProduct);
productRouter.patch("/:id", authMiddleware, ProductController.updateProduct);
productRouter.delete("/:id", authMiddleware, ProductController.deleteProduct);


productRouter.get("/", ProductController.getAllProducts);
productRouter.get("/:id", ProductController.getProduct);


productRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProductValidator,
  validationMiddleware,
  ProductController.addProduct
);

productRouter.patch(
  "/:id",
  authMiddleware,
  updateProductValidator,
  validationMiddleware,
  ProductController.updateProduct
);

productRouter.delete(
  "/:id",
  authMiddleware,
  ProductController.deleteProduct
);

export default productRouter;
