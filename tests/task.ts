import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Task } from "../target/types/task";
import { expect } from "chai";

describe("task", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Task as Program<Task>;
  const admin = provider.wallet as anchor.Wallet;
  
  let globalConfigPda: anchor.web3.PublicKey;
  let taskConfigPda: anchor.web3.PublicKey;
  let taskVaultPda: anchor.web3.PublicKey;
  
  const taskName = `TestTask_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const lockedAmount = new anchor.BN(1000000000); // 1 SOL
  
  // Create test recipients
  const recipient1 = anchor.web3.Keypair.generate();
  const recipient2 = anchor.web3.Keypair.generate();
  const recipient3 = anchor.web3.Keypair.generate();
  
  const recipients = [
    recipient1.publicKey,
    recipient2.publicKey,
    recipient3.publicKey
  ];
  
  const amounts = [
    new anchor.BN(400000000), // 0.4 SOL
    new anchor.BN(300000000), // 0.3 SOL
    new anchor.BN(300000000), // 0.3 SOL
  ];

  before(async () => {
    // Find PDAs
    [globalConfigPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("global_config")],
      program.programId
    );
    
    [taskConfigPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("task"), Buffer.from(taskName)],
      program.programId
    );
    
    [taskVaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("task_vault"), Buffer.from(taskName)],
      program.programId
    );
  });

  it("Initializes the program", async () => {
    await program.methods
      .initialize()
      .accounts({
        globalConfig: globalConfigPda,
        admin: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const globalConfig = await program.account.globalConfig.fetch(globalConfigPda);
    expect(globalConfig.admin.toString()).to.equal(admin.publicKey.toString());
  });

  it("Creates a task with locked SOL", async () => {
    const initialBalance = await provider.connection.getBalance(admin.publicKey);
    
    await program.methods
      .createTask(taskName, lockedAmount)
      .accounts({
        taskConfig: taskConfigPda,
        creator: admin.publicKey,
        taskVault: taskVaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const taskConfig = await program.account.taskConfig.fetch(taskConfigPda);
    expect(taskConfig.name).to.equal(taskName);
    expect(taskConfig.lockedAmount.toString()).to.equal(lockedAmount.toString());
    expect(taskConfig.creator.toString()).to.equal(admin.publicKey.toString());
    expect(taskConfig.rewardDistributionSubmitted).to.equal(false);
    
    // Check that SOL was transferred to task vault
    const vaultBalance = await provider.connection.getBalance(taskVaultPda);
    expect(vaultBalance).to.equal(lockedAmount.toNumber());
    
    // Check that creator's balance decreased
    const finalBalance = await provider.connection.getBalance(admin.publicKey);
    expect(finalBalance).to.be.lessThan(initialBalance);
  });

  it("Submits reward distribution", async () => {
    await program.methods
      .submitRewardDistribution(taskName, recipients, amounts)
      .accounts({
        taskConfig: taskConfigPda,
        creator: admin.publicKey,
      })
      .rpc();

    const taskConfig = await program.account.taskConfig.fetch(taskConfigPda);
    expect(taskConfig.rewardDistributionSubmitted).to.equal(true);
    expect(taskConfig.recipients.length).to.equal(3);
    expect(taskConfig.amounts.length).to.equal(3);
    expect(taskConfig.claimed.length).to.equal(3);
    
    // Verify all claimed flags are initially false
    taskConfig.claimed.forEach(claimed => {
      expect(claimed).to.equal(false);
    });
  });

  it("Fails to submit reward distribution with wrong total", async () => {
    const wrongAmounts = [
      new anchor.BN(400000000), // 0.4 SOL
      new anchor.BN(300000000), // 0.3 SOL
      new anchor.BN(400000000), // 0.4 SOL - Wrong total (1.1 SOL instead of 1 SOL)
    ];
    
    try {
      await program.methods
        .submitRewardDistribution(taskName, recipients, wrongAmounts)
        .accounts({
          taskConfig: taskConfigPda,
          creator: admin.publicKey,
        })
        .rpc();
      
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.include("InvalidRewardDistribution");
    }
  });

  it("Allows recipients to claim their rewards", async () => {
    // Airdrop some SOL to recipients for transaction fees
    for (const recipient of [recipient1, recipient2, recipient3]) {
      await provider.connection.requestAirdrop(
        recipient.publicKey,
        1000000000 // 1 SOL
      );
    }
    
    // Wait for airdrop confirmations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Claim reward for recipient1
    const initialBalance1 = await provider.connection.getBalance(recipient1.publicKey);
    
    await program.methods
      .claimReward(taskName)
      .accounts({
        taskConfig: taskConfigPda,
        taskVault: taskVaultPda,
        claimer: recipient1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([recipient1])
      .rpc();
    
    const finalBalance1 = await provider.connection.getBalance(recipient1.publicKey);
    const expectedIncrease = amounts[0].toNumber();
    
    // Account for transaction fees by checking if balance increased by approximately the reward amount
    expect(finalBalance1 - initialBalance1).to.be.greaterThan(expectedIncrease * 0.99);
    
    // Verify task config updated
    let taskConfig = await program.account.taskConfig.fetch(taskConfigPda);
    expect(taskConfig.claimed[0]).to.equal(true);
    expect(taskConfig.claimed[1]).to.equal(false);
    expect(taskConfig.claimed[2]).to.equal(false);
    
    // Claim reward for recipient2
    await program.methods
      .claimReward(taskName)
      .accounts({
        taskConfig: taskConfigPda,
        taskVault: taskVaultPda,
        claimer: recipient2.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([recipient2])
      .rpc();
    
    taskConfig = await program.account.taskConfig.fetch(taskConfigPda);
    expect(taskConfig.claimed[1]).to.equal(true);
  });

  it("Prevents double claiming", async () => {
    try {
      await program.methods
        .claimReward(taskName)
        .accounts({
          taskConfig: taskConfigPda,
          taskVault: taskVaultPda,
          claimer: recipient1.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([recipient1])
        .rpc();
      
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.include("RewardAlreadyClaimed");
    }
  });

  it("Prevents non-eligible users from claiming", async () => {
    const nonRecipient = anchor.web3.Keypair.generate();
    
    // Airdrop for transaction fees
    await provider.connection.requestAirdrop(
      nonRecipient.publicKey,
      1000000000
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      await program.methods
        .claimReward(taskName)
        .accounts({
          taskConfig: taskConfigPda,
          taskVault: taskVaultPda,
          claimer: nonRecipient.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([nonRecipient])
        .rpc();
      
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.include("NotEligible");
    }
  });
});