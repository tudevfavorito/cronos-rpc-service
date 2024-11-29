# Cronos RPC Service

A Node.js service for interacting with the Cronos blockchain, providing API endpoints for checking CRO and other token balances for an address.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:

   ```
   git clone [<repository-url>](https://github.com/youlgtm/cronos-rpc-service.git)
   ```

   ```
   cd cronos-rpc-service
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Setup environment variables:

   ```
   cp .env.example .env
   ```

   Edit .env with your preferred configuration, or stick with the defaults:

   - NETWORK: Choose between "mainnet" or "testnet". (Default is mainnet)
   - PORT: Choose your port. (Default is 3000)
   - MAINNET_RPC_URL: Choose your mainnet RPC URL.
   - TESTNET_RPC_URL: Choose your tesetnet RPC URL.
   - API_KEY_TTL: Choose length of API key validity in seconds. (Default is 600)
   - LOG_LEVEL: Set your log level configuration (Default is info)

## Running the Service

Start the service:

```
npm run start
```

The server will start on http://localhost:3000 (or your configured PORT)

## API Usage

This guide explains how to use curl to interact with the API. Follow the steps below to generate an API key and query balances.

### Prerequisites

1.  Ensure curl is installed on your system.
    For macOS/Linux, it is usually pre-installed.
    For Windows, download and install curl.

2.  Open a terminal (Command Prompt, PowerShell, or a terminal emulator on Linux/macOS).

### Interact with the API

1. Generate an API key:
   (From your terminal)

   ```
   curl -X POST http://localhost:3000/api/create
   ```

   **_response:_**
   The server will return an API key, which you'll need for subsequent requests. Copy this key and store it securely.

2. Check CRO balance:
   (From your terminal)

   ```
   curl -X GET http://localhost:3000/api/balance/WALLET_ADDRESS \
   -H 'x-api-key: YOUR_API_KEY'
   ```

   - Replace WALLET_ADDRESS with the wallet's address you want to query.
   - Replace YOUR_API_KEY with the API key obtained in Step 1.

   **_response:_** The server will return the CRO balance as a hexadecimal.

3. Check Token balance:
   (From your terminal)
   ```
   curl -X GET http://localhost:3000/api/tokenBalance/TOKEN_ADDRESS/WALLET_ADDRESS \
   -H 'x-api-key: YOUR_API_KEY'
   ```
   - Replace TOKEN_ADDRESS with the address of the token.
   - Replace WALLET_ADDRESS with the wallet's address.
   - Replace YOUR_API_KEY with your API key.
   **_response:_** The server will return the balance of the defined token for the defined wallet as a hexadecimal.

## Testing

Run tests:

```
npm run test
```

Run with coverage:

```
npm run test:coverage
```

## Project Structure

```
src/
config/ - Contains configuration management
controllers/ - Contains the token balances request handlers
middleware/ - Contains an express middleware for api key authentication
routes/ - Contains the API routes
services/ - Contains interactions with the RPC services
utils/ - Containt utility functions
```
