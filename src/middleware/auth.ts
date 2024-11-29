import { Request, Response, NextFunction } from "express";
import { apiKeyService } from "../services/apiKeyService";
import { logger } from "../utils/logger";

// Middleware to authenticate API requests, based on the API key
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const fullPath = `/api${req.path}`;
  console.log("Full path:", fullPath);

  const apiKey = req.headers["x-api-key"];

  if (!apiKey || typeof apiKey !== "string") {
    logger.warn("API request without valid key", {
      ip: req.ip,
      path: fullPath,
    });
    res.status(401).json({ error: "API key is required" });
    return;
  }

  if (!apiKeyService.isValidApiKey(apiKey)) {
    logger.warn("Invalid API key used", {
      ip: req.ip,
      path: fullPath,
      key: apiKey,
    });
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  logger.info("Authenticated request", {
    ip: req.ip,
    path: fullPath,
  });
  next();
};
