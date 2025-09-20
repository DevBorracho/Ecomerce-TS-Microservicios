import { Router } from "express";
import {
  crearProducto,
  obtenerProducto,
  obtenerProductos,
} from "../Queries/products.js";
const router = Router();

router.post("/", async (req, res) => {
  const { nombre, cantidad, unidad, precio, url_image } = req.body;
  try {
    const productos = await crearProducto(
      nombre,
      cantidad,
      unidad,
      precio,
      url_image
    );
    return res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.get("/", async (_req, res) => {
  try {
    const productos = await obtenerProductos();
    if (!productos) return res.json({ msg: "no hay productos" });
    return res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await obtenerProducto(id);
    if (!producto) return res.json({ msg: "no existe ese producto" });
    return res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

export default router;
