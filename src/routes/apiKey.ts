import { Router } from "express";
import { apiKeyService } from "../services/apiKeyService";
import { logger } from "../utils/logger";
import { config } from "../config/index";

const router = Router();

// Health check endpoint
router.get("/test", (_, res) => {
  try {
    const status = {
      status: "ok",
      timestamp: new Date().toISOString(),
      network: config.server.network,
      environment: config.server.nodeEnv,
    };
    res.json(status);
  } catch (error) {
    logger.error("Health check failed", { error });
    res.status(500).json({ status: "error", error: "Health check failed" });
  }
});

// Creates a new API key
router.post("/create", (req, res) => {
  try {
    const apiKey = apiKeyService.createApiKey();
    logger.info("API key created successfully");
    res.json({ apiKey });
  } catch (error) {
    logger.error("Failed to create API key", { error });
    res.status(500).json({ error: "Failed to create API key" });
  }
});

export default router;
