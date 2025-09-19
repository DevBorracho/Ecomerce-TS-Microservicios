import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecomerce",
  password: "jhonathan22",
  port: 5432,
});
export default pool;
