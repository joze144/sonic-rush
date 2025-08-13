# Sonic Rush - Solana Program

This is an Anchor-based Solana program project for token claiming functionality.

## Project Structure

- `programs/sonic-rush/src/` - Main Rust program source code
- `tests/` - TypeScript integration tests
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

- `initialize` - Initialize the program
- `claim_token` - Claim tokens from the program

## Development Notes

- Program uses Anchor framework v0.31.1
- Built for Solana blockchain
- Includes group configuration and token claiming functionality
- Test files use Mocha and Chai for testing