import { Router } from "express";
import { BalanceController } from "../controllers/balanceController";

const router = Router();
const controller = new BalanceController();

//  Routes for balance and token balance, they call the controller
router.get("/balance/:address", (req, res) => controller.getBalance(req, res));
router.get("/tokenBalance/:token/:address", (req, res) =>
  controller.getTokenBalance(req, res)
);

export default router;
