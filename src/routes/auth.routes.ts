
import { authenticate } from "../middlewares/auth.middleware";
import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, (req, res) => {
  return res.json({ message: "You are authenticated", user: (req as any).user });
});


export default router;
