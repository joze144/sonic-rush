import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress 
} from '@solana/spl-token';

export interface InitializeParams {
  name: string;
  members: PublicKey[];
  feeAndRentPayer: PublicKey;
  mainSigningAuthority: PublicKey;
}

export interface ClaimTokenParams {
  groupName: string;
  claimer: PublicKey;
}

export class SonicRushSDK {
  private program: any;
  private programId: PublicKey;

  constructor(
    program: any,
    programId: PublicKey
  ) {
    this.program = program;
    this.programId = programId;
  }

  private getConfigPDA(name: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("CONFIG"), Buffer.from(name)],
      this.programId
    );
  }

  private getGroupTokenMintPDA(name: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("group_token"), Buffer.from(name)],
      this.programId
    );
  }

  async initialize(params: InitializeParams): Promise<Transaction> {
    const [config] = this.getConfigPDA(params.name);
    const [groupTokenMint] = this.getGroupTokenMintPDA(params.name);

    const tx = await this.program.methods
      .initialize(params.name, params.members)
      .accounts({
        feeAndRentPayer: params.feeAndRentPayer,
        mainSigningAuthority: params.mainSigningAuthority,
        config,
        groupTokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .transaction();

    return tx;
  }

  async claimToken(params: ClaimTokenParams): Promise<Transaction> {
    const [config] = this.getConfigPDA(params.groupName);
    const [groupTokenMint] = this.getGroupTokenMintPDA(params.groupName);
    
    const claimerTokenAccount = await getAssociatedTokenAddress(
      groupTokenMint,
      params.claimer
    );

    const tx = await this.program.methods
      .claimToken(params.groupName)
      .accounts({
        claimer: params.claimer,
        config,
        groupTokenMint,
        claimerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return tx;
  }

  async getGroupConfig(groupName: string): Promise<any> {
    const [config] = this.getConfigPDA(groupName);
    try {
      return await (this.program.account as any).groupConfigAccount.fetch(config);
    } catch {
      return null;
    }
  }

  getConfigAddress(groupName: string): PublicKey {
    const [config] = this.getConfigPDA(groupName);
    return config;
  }

  getGroupTokenMintAddress(groupName: string): PublicKey {
    const [groupTokenMint] = this.getGroupTokenMintPDA(groupName);
    return groupTokenMint;
  }
}