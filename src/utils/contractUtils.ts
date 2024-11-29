// Encodes a call to the balanceOf function for token contracts.
export const encodeBalanceOfCall = (address: string): string => {
  const BALANCE_OF_SIGNATURE = "0x70a08231"; // Function signature for balanceOf(address)
  const addressParam = address.slice(2).padStart(64, "0");
  return `${BALANCE_OF_SIGNATURE}${addressParam}`;
};
