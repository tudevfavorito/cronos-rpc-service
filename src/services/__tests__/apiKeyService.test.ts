import { apiKeyService, ApiKeyService } from "../apiKeyService";
import NodeCache from "node-cache";
import { config } from "../../config";

describe("ApiKeyService", () => {
  it("should generate valid API key", () => {
    const apiKey = apiKeyService.createApiKey();
    expect(apiKey).toBeTruthy();
    expect(typeof apiKey).toBe("string");
    expect(apiKey.length).toBe(64); // 32 bytes in hex
  });

  it("should validate existing API key", () => {
    const apiKey = apiKeyService.createApiKey();
    expect(apiKeyService.isValidApiKey(apiKey)).toBe(true);
  });

  it("should invalidate removed API key", () => {
    const apiKey = apiKeyService.createApiKey();
    apiKeyService.removeApiKey(apiKey);
    expect(apiKeyService.isValidApiKey(apiKey)).toBe(false);
  });

  it("should reject invalid API key", () => {
    expect(apiKeyService.isValidApiKey("invalid-key")).toBe(false);
  });

  describe("error handling tests", () => {
    it("should handle cache set failures", () => {
      const mockCache = {
        set: jest.fn().mockReturnValue(false),
        has: jest.fn(),
        del: jest.fn(),
      };

      const service = new ApiKeyService();
      // @ts-ignore
      service.cache = mockCache;

      expect(() => service.createApiKey()).toThrow("Failed to store API key");
    });

    it("should handle cache errors in isValidApiKey", () => {
      jest.spyOn(NodeCache.prototype, "has").mockImplementation(() => {
        throw new Error("Cache error");
      });
      expect(apiKeyService.isValidApiKey("test-key")).toBe(false);
    });

    it("should handle expired keys", () => {
      jest.useFakeTimers();
      const key = apiKeyService.createApiKey();
      jest.advanceTimersByTime(config.api.keyTtl * 1000 + 1000);
      expect(apiKeyService.isValidApiKey(key)).toBe(false);
      jest.useRealTimers();
    });
  });
});
