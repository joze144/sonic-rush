# Squads

Squad transform isolated influencer actions into coordinated attention armies, where elite KOLs become generals who strategically deploy community firepower to crypto projects. It is a paradigm shift from observing attention to engineering it at scale.

## Demo

- Live Demo: [Link to hosted version](https://sonic-squad-u3zv.vercel.app/)

<img width="1213" height="653" alt="Screenshot 2025-08-14 at 19 24 47" src="https://github.com/user-attachments/assets/d3382708-1c9f-498e-a0d3-bbc4836e295d" />

## Problem Statement

The crypto attention economy suffers from structural inefficiencies that prevent optimal value creation and distribution among content creators, influencers, and token projects.

### Key Pain Points

- **Elite KOL Monetization Ceiling**: Top-tier Key Opinion Leaders hit revenue plateaus despite massive influence, unable to scale earnings beyond individual content creation limits.

- **Amplifier Creator Exclusion**: Mid-tier creators with engaged audiences lack access to high-value campaigns and elite collaboration opportunities.

- **Quality vs. Effort Misalignment**: Current reward systems fail to incentivize high-quality content, leading to low-effort posts that dilute ecosystem value.

- **Fragmented Influence Distribution**: Individual creators operate in silos, preventing coordinated attention campaigns that could generate exponential viral impact.

- **Passive Attention Measurement**: Existing platforms only track attention metrics rather than actively engineering and amplifying attention at scale.

- **The Central Challenge**: How can we transform the crypto attention economy from fragmented individual performers into a coordinated system of tokenized attention assets that reward quality, enable scalable monetization, and engineer viral momentum rather than
just measuring it?

This requires a paradigm shift from observing attention to weaponizing it through coordinated squad-based campaigns where elite KOLs become strategic generals deploying amplifier creator armies for maximum impact.


## Features

**"Keys buy entry, squads amplify reach, and collective clout conquers campaigns to split the prize pool."**

> "Purchase a key or invite by eilte KOL → Join an elite squad → Co-create content → Battle for rewards → Profit together."
> 

### 🔑 **Squad Keys: Tokenized Attention Assets**

- Elite KOLs can form Squads
- Recruitment pass for Amplifier Creators with Whitelist
- Squad SPL Token as a tradable attention asset

### 📝 **Tasks: Attention Maketplace**

- Squad members are competing for attention grab through task completion
- Task completion yields rewards for the whole squad
- Oracle is determining price distribution based on squad that earned it and squads SPL token distribution 

### **🎯 Why It’s Addictive:**

- **Elite KOLs**: Monetize authority by selling keys (recurring revenue).
- **Members**: Buy keys for passive upside + status boost.
- **Squads**: Turn content creation into team sports (win-or-burn stakes).
- **Advertisers**: Pay only for provable, amplified attention.

### **💥 vs. Kaito/Cookie:**

While others *measure* attention, **Squads weaponize it** through coordinated creation and tokenized participation.

## Tech Stack

- **Blockchain**: SVM Programs, deployed to Solana devnet
- **Frontend**: React, Tailwind CSS, Next.JS
- **SDK**: Typescript Program Instructions Wrapper
- **Deployment**: Vercel

## Programs Overview

Squad consists of two main programs:
- **squad**: Core token claiming functionality with group management
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
cd squad

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
yarn run ts-mocha tests/squad.ts
```

### Code Quality

```bash
# Check code formatting
npm run lint

# Fix formatting issues
npm run lint:fix
```

## Program Structure

### Squad Program

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
│   ├── squad/          # Main token claiming program
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
├── sdks/                    # TypeScript SDK Program Instruction Wrappers
└── app/                     # Frontend application
```

## Challenges & Learnings

We were both new to solana program development. We learned a lot on how to design escrow, spl tokens, whitelists in programs. 

## Team

- **Yihan**: Role: Product design, Attention calculations
- **Jozhe**: Role: Full-Stack Developer - [GitHub](https://github.com/joze144)

## Future Improvements

- Real time attention analytics
- Oracle for task completion and reward distribution 
- Index on chain data
