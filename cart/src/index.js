import express from "express";

const app = express();

app.use(express.json());
app.use();

app.listen(process.env.PORT || 6000, () => {
  console.log("server is runnig...");
});
