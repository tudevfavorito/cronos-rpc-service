import { RpcClient } from "../rpcClient";
import { config } from "../../config";

global.fetch = jest.fn();

describe("RpcClient", () => {
  let rpcClient: RpcClient;

  beforeEach(() => {
    rpcClient = new RpcClient();
    (fetch as jest.Mock).mockClear();
  });

  it("should handle successful RPC request", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: "0x123" }),
    });

    const result = await rpcClient.request("eth_getBalance", [
      "0x123",
      "latest",
    ]);
    expect(result.result).toBe("0x123");
  });

  it("should handle RPC error response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        error: { message: "Invalid address" },
      }),
    });

    const result = await rpcClient.request("eth_getBalance", ["invalid"]);
    expect(result.error).toContain("Invalid address");
  });

  it("should handle network error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await rpcClient.request("eth_getBalance", ["0x123"]);
    expect(result.error).toBe("Internal RPC error");
  });

  describe("fetchWithTimeout", () => {
    it("should timeout after specified duration", async () => {
      jest.useFakeTimers();
      const mockFetch = jest.fn(() => new Promise<Response>(() => {}));
      global.fetch = mockFetch as jest.Mock<Promise<Response>>;

      const rpcClient = new RpcClient();
      const fetchPromise = rpcClient["fetchWithTimeout"](
        "http://test.com",
        {},
        100
      );

      await Promise.race([
        fetchPromise.catch((error) => {
          expect(error.message).toBe("Request timeout");
        }),
        new Promise((resolve) => {
          jest.runAllTimers();
          resolve(null);
        }),
      ]);

      jest.useRealTimers();
    });

    it("should handle network errors", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
      const rpcClient = new RpcClient();

      await expect(
        rpcClient["fetchWithTimeout"]("http://test.com", {})
      ).rejects.toThrow("Network error");
    });
  });

  describe("network switching", () => {
    it("should use correct URL for mainnet", () => {
      const rpcClient = new RpcClient("mainnet");
      expect(rpcClient["rpcUrl"]).toBe(config.rpc.mainnetUrl);
    });

    it("should use correct URL for testnet", () => {
      const rpcClient = new RpcClient("testnet");
      expect(rpcClient["rpcUrl"]).toBe(config.rpc.testnetUrl);
    });
  });
});
