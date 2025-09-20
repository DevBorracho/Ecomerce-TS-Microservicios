import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/auth.ts";
import productsRouter from "./routes/products.ts";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(productsRouter);
app.get("/ping", (_req, res) => res.send("pong"));
app.listen(process.env.PORT ?? 4000, () => {
  console.log(`Server is running in PORT ${process.env.PORT}`);
});
