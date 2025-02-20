import { Router } from "express";
import { getIntegrationFile, handleTelexTick, handleTelexWebhook } from "../controllers/reminderController";

const router = Router();

// Telex integration json
router.get("/integration.json", getIntegrationFile);

// Route to handle interval ticks from Telex
router.post("/tick", handleTelexTick);

// Route to handle webhook from Telex
router.post("/webhook", handleTelexWebhook);

export default router;
