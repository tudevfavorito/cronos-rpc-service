import { config } from "../config";
import { logger } from "../utils/logger";

export class RpcClient {
  constructor(private network: "mainnet" | "testnet" = "mainnet") {}

  private get rpcUrl(): string {
    return this.network === "testnet"
      ? config.rpc.testnetUrl
      : config.rpc.mainnetUrl;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 10000
  ) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error: unknown) {
      clearTimeout(id);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  async request(method: string, params: any[]): Promise<any> {
    try {
      logger.info("RPC request", { method, params, network: this.network });
      const response = await this.fetchWithTimeout(this.rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method,
          params,
          id: 1,
        }),
      });

      if (!response.ok) {
        const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        logger.error("RPC request failed", {
          method,
          status: response.status,
          statusText: response.statusText,
          network: this.network,
        });
        return { error: errorMessage };
      }

      const data = await response.json().catch(() => {
        logger.error("Invalid JSON response from RPC", { method });
        return { error: "Invalid JSON response" };
      });

      if (data.error) {
        logger.error("RPC error response", {
          method,
          error: data.error,
          network: this.network,
        });
        return {
          error: `RPC error: ${
            data.error.message || JSON.stringify(data.error)
          }`,
        };
      }

      logger.info("RPC success", { method, network: this.network });
      return { result: data.result };
    } catch (error) {
      logger.error("RPC internal error", {
        method,
        error: error instanceof Error ? error.message : "Unknown error",
        network: this.network,
      });
      return { error: "Internal RPC error" };
    }
  }
}
