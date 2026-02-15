import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Eventful API healthy 🚀" });
});

export default router;
