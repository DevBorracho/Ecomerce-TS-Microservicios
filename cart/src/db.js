import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  database: "ecomerce",
  host: "localhost",
  password: "jhonathan22",
  port: 5432,
});

export default pool;
