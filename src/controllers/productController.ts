// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y EL RESPONSE SIEMPRE ESTARÁN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"
import { createProductSchema, updatedProductSchema } from "../validators/productValidator"

class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const products = await Product.find()
      res.json({ success: true, data: products })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" })
      }

      const product = await Product.findById(id)

      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.status(200).json({ success: true, data: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { body } = req

      const { name, description, price, category, stock } = body

      if (!name || !description || !price || !category || !stock) {
        return res.status(400).json({ message: "Todos los campos son requeridos" })
      }

      // VALIDACIONES DE INPUT
      // validar el tipo de data que recibo del front
      // 1 - si para la validación creo el producto
      // 2 - si no pasa la validación retorno una respuesta 400 al front

      const validator = createProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const newProduct = new Product(validator.data)

      await newProduct.save()
      res.status(201).json({ succes: true, data: newProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static updateProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params
      const { body } = req

      if (!Types.ObjectId.isValid(id)) res.status(400).json({ succes: false, error: "ID Inválido" })

      const validator = updatedProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, validator.data, { new: true })

      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, data: updatedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static deleteProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const id = req.params.id

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      const deletedProduct = await Product.findByIdAndDelete(id)

      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.json({ success: true, data: deletedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ error: error.message })
    }
  }
}

export default ProductController