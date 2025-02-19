import { Router } from "express";
import { getIntegrationFile, handleTelexTick } from "../controllers/reminderController";

const router = Router();

// Telex integration json
router.get("/integration.json", getIntegrationFile);

// Route to handle interval ticks from Telex
router.post("/telex-tick", handleTelexTick);

export default router;
