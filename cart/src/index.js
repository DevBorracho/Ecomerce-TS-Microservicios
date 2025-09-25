import express from "express";
import cartRouter from "./routes/cart.js";
const app = express();

app.use(express.json());
app.use(cartRouter);

app.listen(process.env.PORT || 6000, () => {
  console.log("server is runnig...");
});
