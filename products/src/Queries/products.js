import pool from "../db.js";

export const obtenerProductos = async () => {
  const result = await pool.query("SELECT * FROM productos");
  return result.rows[0];
};
export const obtenerProducto = async id => {
  const values = [id];
  const result = await pool.query(
    `SELECT * FROM productos WHERE id = $1`,
    values
  );
  return result.rows[0];
};
export const crearProducto = async (
  nombre,
  cantidad,
  unidad,
  precio,
  url_image
) => {
  const query = `
  INSERT INTO (nombre,cantidad,unidad,precio,url_image)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING * ; 
  `;
  const values = [nombre, cantidad, unidad, precio, url_image];
  const result = await pool.query(query, values);
  return result.rows[0];
};
