import { Router } from "express";
import pool from "../db.js";

const router = Router();
//tablas: carrito y carrito_items
router.get("/", async (req, res) => {
  const userId = req.headers["x-user-id"];
  try {
    const query = `
  SELECT ci.*
  FROM carrito_items ci
  JOIN carrito c ON ci.carrito_id = c.id
  WHERE c.userid = $1
`;
    const values = [userId];
    const { rows } = await pool.query(query, values);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});
//agregar al carrito_items + crear carrito
router.post("/:id", async (req, res) => {
  const cantidad = 1;
  const checkQuery = `select * from carrito where userid = $1`;
  try {
    const result = await pool.query(checkQuery, [req.headers["x-user-id"]]);
    let carritoId;
    if (result.rows.length === 0) {
      const query = `insert into carrito (userid) values ($1);`;
      const values = [req.headers["x-user-id"]];
      const insertResult = await pool.query(query, values);
      carritoId = insertResult.rows[0].id;
    }

    const insertQuery = `insert into carrito_items (carrito_id, 
    producto_id, cantidad) values ($1, $2, $3) RETURNING *;
  `;
    const insertValues = [carritoId, req.params.id, cantidad];
    const insertResult = await pool.query(insertQuery, insertValues);
    return res.json(insertResult.rows[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "error al verificar la existencia de carrito" });
  }
});
router.patch("/agregar/:id", async (req, res) => {
  const query = `update carrito_items set cantidad = cantidad + 1 
    where carrito_id = $1 and producto_id = $2 returning *;
  `;
  const producto_id = req.params.id;
  try {
    const carritoQuery = `select id from carrito where userid = $1;`;
    const carritoValues = [req.headers["x-user-id"]];
    const carritoResult = await pool.query(carritoQuery, carritoValues);
    if (carritoResult.rows.length === 0)
      return res.status(404).json({ msg: "no hay carrito para este usuario" });
    const carrito_id = carritoResult.rows[0].id;
    const updateValues = [carrito_id, producto_id];
    const updateResult = await pool.query(query, updateValues);

    if (updateResult.rows.length === 0) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    return res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar cantidad" });
  }
});
router.patch("/disminuir", async (req, res) => {
  const query = `update carrito_items set cantidad = cantidad - 1 
    where carrito_id = $1 and producto_id = $2 and cantidad > 1 returning *;
  `;
  const producto_id = req.params.id;
  try {
    const carritoQuery = `select id from carrito where userid = $1;`;
    const carritoValues = [req.headers["x-user-id"]];
    const carritoResult = await pool.query(carritoQuery, carritoValues);
    if (carritoResult.rows.length === 0)
      return res.status(404).json({ msg: "no hay carrito para este usuario" });
    const carrito_id = carritoResult.rows[0].id;
    const updateValues = [carrito_id, producto_id];
    const updateResult = await pool.query(query, updateValues);

    if (updateResult.rows.length === 0) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    return res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar cantidad" });
  }
}); //bajar la cantidad en 1
router.delete("/:id", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const productoId = req.params.id;

  try {
    // 1️⃣ buscar carrito del usuario
    const carritoQuery = `SELECT id FROM carrito WHERE userid = $1`;
    const carritoResult = await pool.query(carritoQuery, [userId]);

    if (carritoResult.rows.length === 0) {
      return res
        .status(404)
        .json({ msg: "No existe carrito para este usuario" });
    }

    const carritoId = carritoResult.rows[0].id;

    // 2️⃣ eliminar el producto del carrito
    const deleteQuery = `
      DELETE FROM carrito_items
      WHERE carrito_id = $1 AND producto_id = $2
      RETURNING *;
    `;
    const deleteResult = await pool.query(deleteQuery, [carritoId, productoId]);

    if (deleteResult.rows.length === 0) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    return res.json({
      msg: "Producto eliminado del carrito",
      item: deleteResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error al eliminar producto del carrito" });
  }
});
