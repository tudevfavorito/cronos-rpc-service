import { encodeBalanceOfCall } from "../contractUtils";

describe("contractUtils", () => {
  describe("encodeBalanceOfCall", () => {
    it("should correctly encode balanceOf call", () => {
      const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      const result = encodeBalanceOfCall(address);

      expect(result).toMatch(/^0x70a08231/); // balanceOf function signature
      expect(result.length).toBe(74); // 2 (0x) + 8 (func sig) + 64 (padded address)
      expect(result).toMatch(/742d35Cc6634C0532925a3b844Bc454e4438f44e$/i);
    });
  });
});
