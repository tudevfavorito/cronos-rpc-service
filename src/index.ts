import express from "express";
import balanceRoute from "./routes/balance";
import apiKeyRoute from "./routes/apiKey";
import { authenticateApiKey } from "./middleware/auth";
import { config } from "./config";

const app = express();
const PORT = config.server.port;

app.use(express.json());

// Unprotected routes, healthcheck and generate API key
app.use("/api", apiKeyRoute);

// Authenticate with generated API key
app.use(authenticateApiKey);

// Protected routes accessible with generated API key
app.use("/api", balanceRoute);

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${config.server.nodeEnv} mode`
  );
});
