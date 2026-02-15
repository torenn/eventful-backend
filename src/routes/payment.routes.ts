import { Router } from "express";
import { initializePayment } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/initialize", authenticate, initializePayment);

export default router;
