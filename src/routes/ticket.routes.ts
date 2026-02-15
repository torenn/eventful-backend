
import {
  createTicket,
  scanTicket,
  setReminder,
} from "../controllers/ticket.controller";

import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Protected route
router.post("/", authenticate, createTicket);

export default router;
router.patch(
  "/scan/:ticketId",
  authenticate,
  scanTicket
);

router.patch(
  "/reminder/:ticketId",
  authenticate,
  setReminder
);
