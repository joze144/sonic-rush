# Sonic Rush - Solana Program

This is an Anchor-based Solana program project consisting of two programs:
1. **sonic-rush** - Core token claiming functionality with group-based access control
2. **task** - Task-based reward distribution system

## Project Structure

- `programs/sonic-rush/src/` - Main token claiming program (Program ID: DHiUDknnqsFXtm1RuZMvtx58QSg32uhhym8nTqNhtyvj)
- `programs/task/src/` - Task-based reward program (Program ID: 5168hBAt3ZMd4QMnaRCHYAZCzN1Sv4qfzAWdKkbDzcSZ)
- `tests/` - TypeScript integration tests (sonic-rush.ts, task.ts)
- `app/` - Frontend application (if applicable)
- `migrations/` - Deployment scripts

## Development Commands

### Building and Testing
```bash
# Build the program
anchor build

# Run tests
anchor test

# Run tests with local validator
anchor test --skip-local-validator

# Deploy to localnet
anchor deploy

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### Code Quality
```bash
# Check formatting
npm run lint

# Fix formatting
npm run lint:fix
```

### Solana/Anchor Specific
```bash
# Start local validator
solana-test-validator

# Check program logs
solana logs

# Get program ID
anchor keys list

# Verify program deployment
anchor verify <program-id>
```

## Program Instructions

### Sonic Rush Program
- `initialize(name, members)` - Initialize a new group with specified members
- `claim_token(group_name)` - Claim tokens if user is a member of the group

### Task Program
- `initialize()` - Initialize the task program
- `create_task()` - Create a new task
- `submit_reward_distribution()` - Submit reward distribution for a task
- `claim_reward()` - Claim rewards from completed tasks

## Development Notes

- Project uses Anchor framework v0.31.1
- Built for Solana blockchain
- Includes two separate programs: sonic-rush (group-based token claiming) and task (reward distribution)
- Uses Yarn as package manager
- Test files use Mocha, Chai, and TypeScript for integration testing
- Supports deployment to localnet, devnet, and mainnet