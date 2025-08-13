# Squad Web App

A Next.js web application for interacting with Squad Solana programs. This app allows users to create and join squads, and manage task-based rewards.

## Features

### Squad Management
- **Create Squad**: Create your own squad with a custom name and whitelist member addresses
- **Join Squad**: Join existing squads and claim SPL tokens if your wallet is whitelisted
- **Squad Information**: Search and view squad details including members and token mint

### Task & Rewards
- **Create Tasks**: Create new tasks with locked SOL amounts
- **Submit Rewards**: Submit reward distributions specifying recipients and amounts
- **Claim Rewards**: Claim rewards from completed tasks you're eligible for
- **Task Information**: Search and view task details including completion status

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Wallet Connection

The app uses Solana Wallet Adapter and currently supports:
- Phantom
- Solflare
- Other standard Solana wallets
- Unsafe Burner Wallet (for testing)

## Network

The app is configured to work with Solana Devnet by default.

## Program Integration

The app integrates with two Anchor programs:
- **Squad Program** (`DHiUDknnqsFXtm1RuZMvtx58QSg32uhhym8nTqNhtyvj`)
- **Task Program** (`5168hBAt3ZMd4QMnaRCHYAZCzN1Sv4qfzAWdKkbDzcSZ`)

## Architecture

- **Next.js**: React framework for the frontend
- **TypeScript**: Type safety
- **Solana Web3.js**: Blockchain interaction
- **Anchor**: Program framework integration
- **Custom SDK**: TypeScript SDK for program interactions

## Development

The app structure:
- `pages/` - Next.js pages (index, squad, tasks)
- `hooks/` - Custom React hooks (useSquadSDK)
- `utils/` - Utility functions (transaction handling)
- `styles/` - Global CSS styles
- `components/` - Reusable components (future expansion)