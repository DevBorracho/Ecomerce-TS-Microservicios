import express from "express";
import dotenv from "dotenv";
import router from "./Routes/products.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/products", router);
app.listen(process.env.PORT, () => {
  console.log("Server is running...");
});
