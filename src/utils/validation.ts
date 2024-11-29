// Validates that an address is a valid EVM address
export const isValidEVMAddress = (address: string): boolean => {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
};
