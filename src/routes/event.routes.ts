import { Router } from "express";
import { createEvent, getAllEvents } from "../controllers/event.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Protected route
router.post("/", authenticate, createEvent);
router.get("/", getAllEvents);

export default router;
