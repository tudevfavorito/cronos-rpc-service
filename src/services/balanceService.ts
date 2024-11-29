import { RpcClient } from "../utils/rpcClient";
import { logger } from "../utils/logger";
import { encodeBalanceOfCall } from "../utils/contractUtils";

export class BalanceService {
  private rpcClient: RpcClient;

  constructor() {
    this.rpcClient = new RpcClient();
  }

  async getBalance(address: string) {
    logger.info("Getting balance for address", { address });
    const response = await this.rpcClient.request("eth_getBalance", [
      address,
      "latest",
    ]);

    if ("error" in response) {
      logger.error("RPC error getting balance", { error: response.error });
      throw new Error(response.error);
    }

    return response.result;
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string) {
    logger.info("Getting token balance", { tokenAddress, walletAddress });
    const response = await this.rpcClient.request("eth_call", [
      {
        to: tokenAddress,
        data: encodeBalanceOfCall(walletAddress),
      },
      "latest",
    ]);

    if ("error" in response) {
      logger.error("RPC error getting token balance", {
        error: response.error,
      });
      throw new Error(response.error);
    }

    return response.result;
  }
}
