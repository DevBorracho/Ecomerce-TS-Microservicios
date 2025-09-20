import { Router } from "express";
import type { AuthenticatedRequest } from "../middleware/verifyToken.ts";
import verifyToken from "../middleware/verifyToken.ts";
const url: string = "http://localhost:5000/products/";
const router = Router();

router.get("/products", async (_req, res) => {
  try {
    const data = await fetch(url);
    console.log(data.statusText, data.status);

    if (!data) return res.status(400).json({ msg: "error en la peticion" });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    const data = await fetch(`${url}/${req.params.id}`);
    if (data.status === 404)
      return res.status(404).json({ msg: "no existe el producto" });
    if (!data) return res.status(400).json({ msg: "error en la peticion" });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});
router.post(
  "/products",
  verifyToken,
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.id;
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId ?? "",
        },
        body: JSON.stringify(req.body),
      });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  }
);
export default router;
