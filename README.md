# Sonic Rush

A Solana program built with Anchor framework for token claiming functionality with group-based access control.

## Overview

Sonic Rush consists of two main programs:
- **sonic-rush**: Core token claiming functionality with group management
- **task**: Task-based reward distribution system

## Prerequisites

- [Rust](https://rustup.rs/) 1.70+
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) 1.16+
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) 0.31.1
- [Node.js](https://nodejs.org/) 16+
- [Yarn](https://yarnpkg.com/)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd sonic-rush

# Install dependencies
yarn install

# Build the programs
anchor build
```

## Development

### Local Development

```bash
# Start local Solana validator
solana-test-validator

# In another terminal, deploy programs
anchor deploy

# Run tests
anchor test
```

### Testing

```bash
# Run all tests
anchor test

# Run tests without starting local validator
anchor test --skip-local-validator

# Run specific test file
yarn run ts-mocha tests/sonic-rush.ts
```

### Code Quality

```bash
# Check code formatting
npm run lint

# Fix formatting issues
npm run lint:fix
```

## Program Structure

### Sonic Rush Program

**Program ID**: `DHiUDknnqsFXtm1RuZMvtx58QSg32uhhym8nTqNhtyvj`

#### Instructions
- `initialize(name, members)` - Initialize a new group with specified members
- `claim_token(group_name)` - Claim tokens if user is a member of the group

#### States
- `GroupConfigAccount` - Stores group configuration and member list

### Task Program

**Program ID**: `5168hBAt3ZMd4QMnaRCHYAZCzN1Sv4qfzAWdKkbDzcSZ`

#### Instructions
- `initialize()` - Initialize the task program
- `create_task()` - Create a new task
- `submit_reward_distribution()` - Submit reward distribution for a task
- `claim_reward()` - Claim rewards from completed tasks

#### States
- `TaskConfig` - Stores task configuration and reward information

## Deployment

### Localnet
```bash
anchor deploy
```

### Devnet
```bash
anchor deploy --provider.cluster devnet
```

### Mainnet
```bash
anchor deploy --provider.cluster mainnet
```

## Configuration

The project is configured through `Anchor.toml`:
- Uses Yarn as package manager
- Localnet cluster by default
- Wallet: `~/.config/solana/id.json`

## Project Structure

```
├── programs/
│   ├── sonic-rush/          # Main token claiming program
│   │   └── src/
│   │       ├── instructions/
│   │       ├── states/
│   │       ├── events/
│   │       └── lib.rs
│   └── task/                # Task-based reward program
│       └── src/
│           ├── instructions/
│           ├── states/
│           ├── events/
│           └── lib.rs
├── tests/                   # Integration tests
├── migrations/              # Deployment scripts
└── app/                     # Frontend application (if applicable)
```

## License

ISC