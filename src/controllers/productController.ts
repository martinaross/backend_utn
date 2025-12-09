import { Request, Response } from "express";
import Product from "../model/ProductModel";
import { Types } from "mongoose";

class ProductController {

  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const { name, stock, category, minPrice, maxPrice } = req.query;

      const filter: any = {};

      if (name) filter.name = new RegExp(String(name), "i");
      if (stock) filter.stock = Number(stock);
      if (category) filter.category = new RegExp(String(category), "i");

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
      }

      const products = await Product.find(filter);
      return res.json({ success: true, data: products });

    } catch (e) {
      return res.status(500).json({ success: false, error: (e as Error).message });
    }
  };

  static getProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID inválido" });
      }

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, error: "Producto no encontrado" });

      return res.json({ success: true, data: product });

    } catch (e) {
      return res.status(500).json({ success: false, error: (e as Error).message });
    }
  };

  static addProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, category, stock } = req.body;

      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        image: req.file?.path || "No contiene imagen"
      });

      await newProduct.save();

      return res.status(201).json({ success: true, data: newProduct });

    } catch (e) {
      return res.status(500).json({ success: false, error: (e as Error).message });
    }
  };

  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID inválido" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" });
      }

      return res.json({ success: true, data: updatedProduct });

    } catch (e) {
      return res.status(500).json({ success: false, error: (e as Error).message });
    }
  };

  static deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID inválido" });
      }

      const deleted = await Product.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" });
      }

      return res.json({ success: true, data: deleted });

    } catch (e) {
      return res.status(500).json({ success: false, error: (e as Error).message });
    }
  };
}

export default ProductController;
