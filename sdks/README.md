# Sonic Rush SDK

TypeScript SDK for interacting with the Sonic Rush Solana programs.

## Installation

```bash
npm install @sonic-rush/sdk
```

## Usage

### Initialize the SDK

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import SonicRushProjectSDK from '@sonic-rush/sdk';

// Create connection to Solana
const connection = new Connection('https://api.devnet.solana.com');

// Initialize SDK with default program IDs
const sdk = await SonicRushProjectSDK.init({
  connection,
});

// Or initialize with custom program IDs
const sdk = await SonicRushProjectSDK.init({
  connection,
  sonicRushProgramId: new PublicKey('YOUR_SONIC_RUSH_PROGRAM_ID'),
  taskProgramId: new PublicKey('YOUR_TASK_PROGRAM_ID'),
});
```

### Sonic Rush Program

#### Initialize a Group

```typescript
import { PublicKey } from '@solana/web3.js';

const members = [
  new PublicKey('MEMBER_1_PUBKEY'),
  new PublicKey('MEMBER_2_PUBKEY'),
];

const tx = await sdk.sonicRush.initialize({
  name: 'my-group',
  members,
  feeAndRentPayer: payerPublicKey,
  mainSigningAuthority: authorityPublicKey,
});

// Sign and send transaction
```

#### Claim Tokens

```typescript
const tx = await sdk.sonicRush.claimToken({
  groupName: 'my-group',
  claimer: claimerPublicKey,
});

// Sign and send transaction
```

#### Get Group Configuration

```typescript
const groupConfig = await sdk.sonicRush.getGroupConfig('my-group');
console.log('Group members:', groupConfig.members);
console.log('Claimed members:', groupConfig.claimedMembers);
```

### Task Program

#### Initialize Task Program

```typescript
const tx = await sdk.task.initialize({
  admin: adminPublicKey,
});
```

#### Create a Task

```typescript
import { BN } from '@project-serum/anchor';

const tx = await sdk.task.createTask({
  name: 'my-task',
  lockedAmount: new BN(1000000), // Amount in lamports
  creator: creatorPublicKey,
});
```

#### Submit Reward Distribution

```typescript
const recipients = [
  new PublicKey('RECIPIENT_1'),
  new PublicKey('RECIPIENT_2'),
];

const amounts = [
  new BN(500000), // 0.5 SOL in lamports
  new BN(500000), // 0.5 SOL in lamports
];

const tx = await sdk.task.submitRewardDistribution({
  taskName: 'my-task',
  recipients,
  amounts,
  creator: creatorPublicKey,
});
```

#### Claim Reward

```typescript
const tx = await sdk.task.claimReward({
  taskName: 'my-task',
  claimer: claimerPublicKey,
});
```

#### Get Task Configuration

```typescript
const taskConfig = await sdk.task.getTaskConfig('my-task');
console.log('Task creator:', taskConfig.creator);
console.log('Locked amount:', taskConfig.lockedAmount);
console.log('Recipients:', taskConfig.recipients);
```

## Utility Methods

### Get Program Addresses

```typescript
// Get group config PDA
const configAddress = sdk.sonicRush.getConfigAddress('my-group');

// Get group token mint PDA
const mintAddress = sdk.sonicRush.getGroupTokenMintAddress('my-group');

// Get task config PDA
const taskConfigAddress = sdk.task.getTaskConfigAddress('my-task');

// Get task vault PDA
const taskVaultAddress = sdk.task.getTaskVaultAddress('my-task');
```

### Get Default Program IDs

```typescript
const { sonicRush, task } = SonicRushProjectSDK.getDefaultProgramIds();
console.log('Sonic Rush Program ID:', sonicRush.toString());
console.log('Task Program ID:', task.toString());
```

## Building

```bash
npm run build
```

## License

MIT