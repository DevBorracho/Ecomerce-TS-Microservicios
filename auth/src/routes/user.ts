import { Router } from "express";
import createToken from "../utils/jwt.ts";
import getUserByEmail, { createUser } from "../models/userQuerys.ts";
import { compare, hash } from "bcrypt";
const router = Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const passwordHash: string = await hash(password, 8);

    const user = await getUserByEmail(email);
    if (user) return res.status(400).json({ msg: "el usuario ya existe" });
    const newUser = await createUser({ username, email, passwordHash });
    console.log(newUser);
    const token = await createToken({ id: newUser.id });
    return res.json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      ROLE: newUser.role,
      accessToken: token,
      created_At: newUser.created_at,
    });
  } catch (error) {
    return res.json(error);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "email invalido" });
    const userMatch = await compare(password, user.password as string);
    if (!userMatch) return res.json({ msg: "password invalida" });
    const token = await createToken({ id: user.id });
    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    return res.json(error);
  }
});

router.post("/logout", (req, _res) => {
  return _res.json({ msg: "sesion cerrada correctamente" });
});

export default router;
