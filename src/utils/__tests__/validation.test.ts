import { isValidEVMAddress } from "../validation";

describe("Ethereum Address Validation", () => {
  it("should validate correct Ethereum addresses", () => {
    expect(
      isValidEVMAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
    ).toBe(true);
  });

  it("should reject addresses without 0x prefix", () => {
    expect(isValidEVMAddress("742d35Cc6634C0532925a3b844Bc454e4438f44e")).toBe(
      false
    );
  });

  it("should reject addresses with invalid length", () => {
    expect(isValidEVMAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44")).toBe(
      false
    );
  });

  it("should reject addresses with invalid characters", () => {
    expect(
      isValidEVMAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44g")
    ).toBe(false);
  });
});
