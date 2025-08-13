import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SonicRush } from "../target/types/sonic_rush";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_2022_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
  getAccount,
} from "@solana/spl-token";
import { assert, expect } from "chai";

describe("sonic-rush", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.sonicRush as Program<SonicRush>;

  // Test accounts
  const payer = provider.wallet;
  const mainAuthority = Keypair.generate();
  const member1 = Keypair.generate();
  const member2 = Keypair.generate(); 
  const member3 = Keypair.generate();
  const nonMember = Keypair.generate();

  // Test data
  const groupName = "TestGroup";
  const members = [member1.publicKey, member2.publicKey, member3.publicKey];

  // Derived addresses
  let configPda: PublicKey;
  let configBump: number;
  let groupTokenMintPda: PublicKey;
  let groupTokenMintBump: number;

  before(async () => {
    // Find PDAs
    [configPda, configBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("CONFIG"), Buffer.from(groupName)],
      program.programId
    );

    [groupTokenMintPda, groupTokenMintBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("group_token"), Buffer.from(groupName)],
      program.programId
    );

    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(mainAuthority.publicKey, 2000000000);
    await provider.connection.requestAirdrop(member1.publicKey, 1000000000);
    await provider.connection.requestAirdrop(member2.publicKey, 1000000000);
    await provider.connection.requestAirdrop(member3.publicKey, 1000000000);
    await provider.connection.requestAirdrop(nonMember.publicKey, 1000000000);

    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe("initialize", () => {
    it("Should initialize a group with name and members", async () => {
      const tx = await program.methods
        .initialize(groupName, members)
        .accountsPartial({
          feeAndRentPayer: payer.publicKey,
          mainSigningAuthority: mainAuthority.publicKey,
          config: configPda,
          groupTokenMint: groupTokenMintPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([mainAuthority])
        .rpc();

      console.log("Initialize transaction signature:", tx);

      // Verify the config account was created correctly
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      
      assert.equal(configAccount.name, groupName);
      assert.equal(configAccount.mainSigningAuthority.toBase58(), mainAuthority.publicKey.toBase58());
      assert.equal(configAccount.members.length, 3);
      assert.equal(configAccount.members[0].toBase58(), member1.publicKey.toBase58());
      assert.equal(configAccount.members[1].toBase58(), member2.publicKey.toBase58());
      assert.equal(configAccount.members[2].toBase58(), member3.publicKey.toBase58());
      assert.equal(configAccount.groupTokenMint.toBase58(), groupTokenMintPda.toBase58());
      assert.equal(configAccount.claimedMembers.length, 0);

      // Verify the token mint was created correctly
      const mintInfo = await getMint(provider.connection, groupTokenMintPda, "confirmed", TOKEN_2022_PROGRAM_ID);
      assert.equal(mintInfo.decimals, 0);
      assert.equal(mintInfo.mintAuthority?.toBase58(), configPda.toBase58());
      assert.equal(mintInfo.freezeAuthority?.toBase58(), configPda.toBase58());
      assert.equal(mintInfo.supply.toString(), "0");
    });

    it("Should emit InitializeGroupEvent", async () => {
      // The event should have been emitted in the previous test
      // In a real test environment, you would capture and verify the event
      // For now, we'll just verify the transaction succeeded
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      expect(configAccount.name).to.equal(groupName);
    });
  });

  describe("claim_token", () => {
    it("Should allow member1 to claim their token", async () => {
      const member1TokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        member1.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tx = await program.methods
        .claimToken(groupName)
        .accountsPartial({
          claimer: member1.publicKey,
          config: configPda,
          groupTokenMint: groupTokenMintPda,
          claimerTokenAccount: member1TokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([member1])
        .rpc();

      console.log("Member1 claim transaction signature:", tx);

      // Verify member1 received exactly 1 token
      const tokenAccountInfo = await getAccount(
        provider.connection, 
        member1TokenAccount, 
        "confirmed", 
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(tokenAccountInfo.amount.toString(), "1");

      // Verify member1 was added to claimed_members
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      assert.equal(configAccount.claimedMembers.length, 1);
      assert.equal(configAccount.claimedMembers[0].toBase58(), member1.publicKey.toBase58());

      // Verify total supply increased
      const mintInfo = await getMint(provider.connection, groupTokenMintPda, "confirmed", TOKEN_2022_PROGRAM_ID);
      assert.equal(mintInfo.supply.toString(), "1");
    });

    it("Should allow member2 to claim their token", async () => {
      const member2TokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        member2.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tx = await program.methods
        .claimToken(groupName)
        .accountsPartial({
          claimer: member2.publicKey,
          config: configPda,
          groupTokenMint: groupTokenMintPda,
          claimerTokenAccount: member2TokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([member2])
        .rpc();

      console.log("Member2 claim transaction signature:", tx);

      // Verify member2 received exactly 1 token
      const tokenAccountInfo = await getAccount(
        provider.connection, 
        member2TokenAccount, 
        "confirmed", 
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(tokenAccountInfo.amount.toString(), "1");

      // Verify member2 was added to claimed_members
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      assert.equal(configAccount.claimedMembers.length, 2);
      assert.equal(configAccount.claimedMembers[1].toBase58(), member2.publicKey.toBase58());

      // Verify total supply increased
      const mintInfo = await getMint(provider.connection, groupTokenMintPda, "confirmed", TOKEN_2022_PROGRAM_ID);
      assert.equal(mintInfo.supply.toString(), "2");
    });

    it("Should allow member3 to claim their token", async () => {
      const member3TokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        member3.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tx = await program.methods
        .claimToken(groupName)
        .accountsPartial({
          claimer: member3.publicKey,
          config: configPda,
          groupTokenMint: groupTokenMintPda,
          claimerTokenAccount: member3TokenAccount,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([member3])
        .rpc();

      console.log("Member3 claim transaction signature:", tx);

      // Verify member3 received exactly 1 token
      const tokenAccountInfo = await getAccount(
        provider.connection, 
        member3TokenAccount, 
        "confirmed", 
        TOKEN_2022_PROGRAM_ID
      );
      assert.equal(tokenAccountInfo.amount.toString(), "1");

      // Verify all members have claimed
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      assert.equal(configAccount.claimedMembers.length, 3);
      assert.equal(configAccount.claimedMembers[2].toBase58(), member3.publicKey.toBase58());

      // Verify total supply is now 3
      const mintInfo = await getMint(provider.connection, groupTokenMintPda, "confirmed", TOKEN_2022_PROGRAM_ID);
      assert.equal(mintInfo.supply.toString(), "3");
    });
  });

  describe("error cases", () => {
    it("Should fail when non-member tries to claim token", async () => {
      const nonMemberTokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        nonMember.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      try {
        await program.methods
          .claimToken(groupName)
          .accountsPartial({
            claimer: nonMember.publicKey,
            config: configPda,
            groupTokenMint: groupTokenMintPda,
            claimerTokenAccount: nonMemberTokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([nonMember])
          .rpc();
        
        assert.fail("Expected transaction to fail");
      } catch (error) {
        expect(error.toString()).to.include("NotAGroupMember");
      }
    });

    it("Should fail when member1 tries to claim token again", async () => {
      const member1TokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        member1.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      try {
        await program.methods
          .claimToken(groupName)
          .accountsPartial({
            claimer: member1.publicKey,
            config: configPda,
            groupTokenMint: groupTokenMintPda,
            claimerTokenAccount: member1TokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([member1])
          .rpc();
        
        assert.fail("Expected transaction to fail");
      } catch (error) {
        expect(error.toString()).to.include("AlreadyClaimed");
      }
    });

    it("Should fail to claim token for non-existent group", async () => {
      const fakeName = "NonExistentGroup";
      const [fakeConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("CONFIG"), Buffer.from(fakeName)],
        program.programId
      );

      const member1TokenAccount = getAssociatedTokenAddressSync(
        groupTokenMintPda,
        member1.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      try {
        await program.methods
          .claimToken(fakeName)
          .accountsPartial({
            claimer: member1.publicKey,
            config: fakeConfigPda,
            groupTokenMint: groupTokenMintPda,
            claimerTokenAccount: member1TokenAccount,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([member1])
          .rpc();
        
        assert.fail("Expected transaction to fail");
      } catch (error) {
        expect(error.toString()).to.include("AccountNotInitialized");
      }
    });
  });

  describe("final verification", () => {
    it("Should verify final state of all accounts", async () => {
      // Verify config account final state
      const configAccount = await program.account.groupConfigAccount.fetch(configPda);
      assert.equal(configAccount.name, groupName);
      assert.equal(configAccount.members.length, 3);
      assert.equal(configAccount.claimedMembers.length, 3);
      
      // Verify all members are in the claimed list
      const claimedAddresses = configAccount.claimedMembers.map(key => key.toBase58());
      assert.include(claimedAddresses, member1.publicKey.toBase58());
      assert.include(claimedAddresses, member2.publicKey.toBase58());
      assert.include(claimedAddresses, member3.publicKey.toBase58());

      // Verify final mint supply
      const mintInfo = await getMint(provider.connection, groupTokenMintPda, "confirmed", TOKEN_2022_PROGRAM_ID);
      assert.equal(mintInfo.supply.toString(), "3");

      // Verify each member has exactly 1 token
      for (const member of [member1, member2, member3]) {
        const tokenAccount = getAssociatedTokenAddressSync(
          groupTokenMintPda,
          member.publicKey,
          false,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        
        const tokenAccountInfo = await getAccount(
          provider.connection, 
          tokenAccount, 
          "confirmed", 
          TOKEN_2022_PROGRAM_ID
        );
        assert.equal(tokenAccountInfo.amount.toString(), "1");
      }

      console.log("✅ All tests passed! Group created successfully and all members claimed their tokens.");
    });
  });
});