import { Request, Response } from "express";
import { BalanceController } from "../balanceController";
import { BalanceService } from "../../services/balanceService";

jest.mock("../../services/balanceService");

const createMockRequest = (params: any = {}): Partial<Request> => ({
  params,
  get: jest.fn(),
  header: jest.fn(),
});

describe("BalanceController", () => {
  let controller: BalanceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    controller = new BalanceController();
  });

  describe("getBalance", () => {
    it("should return 400 if address is missing", async () => {
      mockRequest = createMockRequest();

      await controller.getBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Address is required" });
    });

    it("should return 400 if address is invalid", async () => {
      mockRequest = createMockRequest({ address: "invalid-address" });

      await controller.getBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Invalid Ethereum address format",
      });
    });

    it("should return balance for valid address", async () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      mockRequest = createMockRequest({ address: validAddress });

      jest
        .spyOn(BalanceService.prototype, "getBalance")
        .mockResolvedValueOnce("1000000000000000000");

      await controller.getBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockJson).toHaveBeenCalledWith({ balance: "1000000000000000000" });
    });

    it("should handle rpc errors", async () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      mockRequest = createMockRequest({ address: validAddress });

      jest
        .spyOn(BalanceService.prototype, "getBalance")
        .mockRejectedValueOnce(new Error("RPC Error"));

      await controller.getBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(502);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Failed to fetch balance",
      });
    });
  });

  describe("getTokenBalance", () => {
    it("should return 400 if token address is missing", async () => {
      mockRequest = createMockRequest({
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      });

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Token and address are required",
      });
    });

    it("should return 400 if wallet address is missing", async () => {
      mockRequest = createMockRequest({
        token: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      });

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Token and address are required",
      });
    });

    it("should return 400 if token address is invalid", async () => {
      mockRequest = createMockRequest({
        token: "invalid-token",
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      });

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Invalid token address format",
      });
    });

    it("should return 400 if wallet address is invalid", async () => {
      mockRequest = createMockRequest({
        token: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        address: "invalid-address",
      });

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Invalid wallet address format",
      });
    });

    it("should return token balance for valid addresses", async () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const validToken = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";
      mockRequest = createMockRequest({
        token: validToken,
        address: validAddress,
      });

      jest
        .spyOn(BalanceService.prototype, "getTokenBalance")
        .mockResolvedValueOnce("1000000");

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockJson).toHaveBeenCalledWith({ balance: "1000000" });
    });

    it("should handle service errors", async () => {
      const validAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const validToken = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";
      mockRequest = createMockRequest({
        token: validToken,
        address: validAddress,
      });

      jest
        .spyOn(BalanceService.prototype, "getTokenBalance")
        .mockRejectedValueOnce(new Error("RPC Error"));

      await controller.getTokenBalance(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(mockStatus).toHaveBeenCalledWith(502);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Failed to fetch token balance",
      });
    });
  });

  describe("error handling", () => {
    it("should handle malformed JSON responses", async () => {
      jest
        .spyOn(BalanceService.prototype, "getBalance")
        .mockRejectedValue(new Error("Invalid JSON"));

      await controller.getBalance(
        createMockRequest({
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        }) as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(502);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Failed to fetch balance",
      });
    });

    it("should handle network timeouts", async () => {
      jest
        .spyOn(BalanceService.prototype, "getBalance")
        .mockRejectedValue(new Error("Request timeout"));

      await controller.getBalance(
        createMockRequest({
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        }) as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(502);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Failed to fetch balance",
      });
    });
  });
});
