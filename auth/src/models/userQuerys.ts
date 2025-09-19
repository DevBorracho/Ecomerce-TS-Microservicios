import pool from "../config/db.ts";

interface newUser {
  username: string;
  email: string;
  passwordHash: string;
}

export async function createUser(user: newUser) {
  try {
    const query = `
      INSERT INTO usuario (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, role, created_at;
    `;
    const values = [user.username, user.email, user.passwordHash];

    console.log("Ejecutando query:", query);
    console.log("Con valores:", values);

    const result = await pool.query(query, values);
    console.log("Resultado:", result.rows);

    return result.rows[0];
  } catch (err) {
    console.error("❌ Error en createUser:", err);
    throw err;
  }
}
//buscar usuario por email
export default async function getUserByEmail(email: string) {
  const query = `
    SELECT * FROM usuario WHERE email = $1;`;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
}
