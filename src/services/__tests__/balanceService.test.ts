import { BalanceService } from "../balanceService";
import { RpcClient } from "../../utils/rpcClient";

jest.mock("../../utils/rpcClient");

describe("BalanceService", () => {
  let service: BalanceService;

  beforeEach(() => {
    service = new BalanceService();
  });

  describe("getBalance", () => {
    it("should return balance for successful request", async () => {
      jest
        .spyOn(RpcClient.prototype, "request")
        .mockResolvedValueOnce({ result: "1000000000000000000" });

      const result = await service.getBalance(
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      );
      expect(result).toBe("1000000000000000000");
    });

    it("should throw error for failed request", async () => {
      jest
        .spyOn(RpcClient.prototype, "request")
        .mockResolvedValueOnce({ error: "RPC Error" });

      await expect(
        service.getBalance("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
      ).rejects.toThrow("RPC Error");
    });
  });

  describe("getTokenBalance", () => {
    it("should return token balance for successful request", async () => {
      jest
        .spyOn(RpcClient.prototype, "request")
        .mockResolvedValueOnce({ result: "1000000" });

      const result = await service.getTokenBalance(
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      );
      expect(result).toBe("1000000");
    });

    it("should throw error for failed request", async () => {
      jest
        .spyOn(RpcClient.prototype, "request")
        .mockResolvedValueOnce({ error: "RPC Error" });

      await expect(
        service.getTokenBalance(
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        )
      ).rejects.toThrow("RPC Error");
    });

    it("should throw error for network failure", async () => {
      jest
        .spyOn(RpcClient.prototype, "request")
        .mockRejectedValueOnce(new Error("Network Error"));

      await expect(
        service.getTokenBalance(
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        )
      ).rejects.toThrow("Network Error");
    });
  });
});
