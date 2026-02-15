import { Router } from "express";
import {
  getEventTicketCount,
  getCreatorAnalytics,
} from "../controllers/analytics.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Public: get ticket count for specific event
router.get("/event/:eventId", getEventTicketCount);

// Protected: creator analytics
router.get("/creator", authenticate, getCreatorAnalytics);

export default router;
