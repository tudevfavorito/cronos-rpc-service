import NodeCache from "node-cache";
import crypto from "crypto";
import { config } from "../config";
import { logger } from "../utils/logger";

export class ApiKeyService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = config.api.keyTtl) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds });
  }

  generateApiKey(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  createApiKey(): string {
    const apiKey = this.generateApiKey();
    const success = this.cache.set(apiKey, true);

    if (!success) {
      const error = new Error("Failed to store API key");
      logger.error("Failed to store API key in cache");
      throw error;
    }

    return apiKey;
  }

  isValidApiKey(apiKey: string): boolean {
    try {
      return this.cache.has(apiKey);
    } catch (error) {
      logger.error("Error validating API key", { error });
      return false;
    }
  }

  removeApiKey(apiKey: string): void {
    try {
      this.cache.del(apiKey);
    } catch (error) {
      logger.error("Error removing API key", { error });
      throw error;
    }
  }
}

export const apiKeyService = new ApiKeyService();
