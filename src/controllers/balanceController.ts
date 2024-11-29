import { Request, Response } from "express";
import { BalanceService } from "../services/balanceService";
import { isValidEVMAddress } from "../utils/validation";
import { logger } from "../utils/logger";

// Balance controller provides pre-validation for the balance and token balance endpoints
// Balance controller also executes the balance and token balance requests
export class BalanceController {
  private balanceService: BalanceService;

  constructor() {
    this.balanceService = new BalanceService();
  }

  async getBalance(req: Request, res: Response) {
    const { address } = req.params;

    if (!address) {
      logger.warn("Missing address parameter");
      res.status(400).json({ error: "Address is required" });
      return;
    }

    if (!isValidEVMAddress(address)) {
      logger.warn("Invalid Ethereum address", { address });
      res.status(400).json({ error: "Invalid Ethereum address format" });
      return;
    }

    try {
      const balance = await this.balanceService.getBalance(address);
      res.json({ balance });
    } catch (error) {
      logger.error("Error getting balance", { error });
      res.status(502).json({ error: "Failed to fetch balance" });
    }
  }

  async getTokenBalance(req: Request, res: Response) {
    const { token, address } = req.params;

    if (!token || !address) {
      logger.warn("Missing parameters");
      res.status(400).json({ error: "Token and address are required" });
      return;
    }

    if (!isValidEVMAddress(token)) {
      logger.warn("Invalid token address", { token });
      res.status(400).json({ error: "Invalid token address format" });
      return;
    }

    if (!isValidEVMAddress(address)) {
      logger.warn("Invalid wallet address", { address });
      res.status(400).json({ error: "Invalid wallet address format" });
      return;
    }

    try {
      const balance = await this.balanceService.getTokenBalance(token, address);
      res.json({ balance });
    } catch (error) {
      logger.error("Error getting token balance", { error });
      res.status(502).json({ error: "Failed to fetch token balance" });
    }
  }
}
