import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getShareableLink,
} from "../controllers/event.controller";


import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Protected route
router.post("/", authenticate, createEvent);
router.get("/", getAllEvents);
router.get("/:eventId/share", getShareableLink);


export default router;
