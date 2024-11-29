import express from "express";

const router = express.Router();

// Health check test
router.get("/test", async (req, res) => {
  try {
    res.json({ message: "Pong" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

export default router;
