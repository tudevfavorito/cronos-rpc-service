import dotenv from "dotenv";

// Load environment variables
dotenv.config();

type Network = "mainnet" | "testnet";

// Define if using RPC for mainnet or testnet
const getRpcUrl = (
  network: string = process.env.NETWORK || "mainnet"
): string => {
  switch (network as Network) {
    case "testnet":
      return process.env.TESTNET_RPC_URL || "https://evm-t3.cronos.org";
    case "mainnet":
    default:
      return process.env.MAINNET_RPC_URL || "https://evm.cronos.org";
  }
};
export const config = {
  // Define server config, deafault is localhost:3000
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    network: process.env.NETWORK || "mainnet",
  },
  // Define rpc config, default is mainnet
  rpc: {
    url: getRpcUrl(),
    mainnetUrl: process.env.MAINNET_RPC_URL || "https://evm.cronos.org",
    testnetUrl: process.env.TESTNET_RPC_URL || "https://evm-t3.cronos.org",
  },
  // Define the API key config, TTL defines key expiration time in seconds
  api: {
    keyTtl: parseInt(process.env.API_KEY_TTL || "3600", 10),
  },
  // Define logging config, default is info
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
