import request from "supertest";
import express from "express";
import { apiKeyService } from "../../services/apiKeyService";
import apiKeyRoute from "../apiKey";
import balanceRoute from "../balance";
import { authenticateApiKey } from "../../middleware/auth";

const app = express();
app.use(express.json());
app.use("/api", apiKeyRoute);
app.use(authenticateApiKey);
app.use("/api", balanceRoute);

describe("API Routes", () => {
  let validApiKey: string;

  beforeEach(() => {
    validApiKey = apiKeyService.createApiKey();
  });

  describe("API Key Creation", () => {
    it("should create new API key", async () => {
      const response = await request(app).post("/api/create").expect(200);

      expect(response.body.apiKey).toBeTruthy();
      expect(typeof response.body.apiKey).toBe("string");
    });
  });

  describe("Balance Endpoint", () => {
    it("should reject requests without API key", async () => {
      await request(app).get("/api/balance/0x123").expect(401);
    });

    it("should reject invalid API key", async () => {
      await request(app)
        .get("/api/balance/0x123")
        .set("x-api-key", "invalid-key")
        .expect(401);
    });

    it("should accept valid API key", async () => {
      const response = await request(app)
        .get("/api/balance/0xC053Cb130408c19c852a9b72Ce0b447A2557EE9d")
        .set("x-api-key", validApiKey)
        .expect(200);

      expect(response.body.error).toBeFalsy();
    });
  });

  describe("Token Balance Endpoint", () => {
    const validToken = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    const validAddress = "0xC053Cb130408c19c852a9b72Ce0b447A2557EE9d";

    it("should reject token balance requests with invalid API key", async () => {
      await request(app)
        .get(`/api/tokenBalance/${validToken}/${validAddress}`)
        .set("x-api-key", "invalid-key")
        .expect(401);
    });

    it("should reject requests with invalid token address", async () => {
      await request(app)
        .get(`/api/tokenBalance/invalid-token/${validAddress}`)
        .set("x-api-key", validApiKey)
        .expect(400)
        .then((response) => {
          expect(response.body.error).toBe("Invalid token address format");
        });
    });

    it("should reject requests with invalid wallet address", async () => {
      await request(app)
        .get(`/api/tokenBalance/${validToken}/invalid-address`)
        .set("x-api-key", validApiKey)
        .expect(400)
        .then((response) => {
          expect(response.body.error).toBe("Invalid wallet address format");
        });
    });

    it("should accept valid token balance request", async () => {
      await request(app)
        .get(`/api/tokenBalance/${validToken}/${validAddress}`)
        .set("x-api-key", validApiKey)
        .expect(200)
        .then((response) => {
          expect(response.body.error).toBeFalsy();
          expect(response.body).toHaveProperty("balance");
        });
    });
  });
});
