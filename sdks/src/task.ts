import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram 
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface InitializeTaskProgramParams {
  admin: PublicKey;
}

export interface CreateTaskParams {
  name: string;
  lockedAmount: BN;
  creator: PublicKey;
}

export interface SubmitRewardDistributionParams {
  taskName: string;
  recipients: PublicKey[];
  amounts: BN[];
  creator: PublicKey;
}

export interface ClaimRewardParams {
  taskName: string;
  claimer: PublicKey;
}

export class TaskSDK {
  private program: any;
  private programId: PublicKey;

  constructor(
    program: any,
    programId: PublicKey
  ) {
    this.program = program;
    this.programId = programId;
  }

  private getGlobalConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("global_config")],
      this.programId
    );
  }

  private getTaskConfigPDA(taskName: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("task"), Buffer.from(taskName)],
      this.programId
    );
  }

  private getTaskVaultPDA(taskName: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("task_vault"), Buffer.from(taskName)],
      this.programId
    );
  }

  async initialize(params: InitializeTaskProgramParams): Promise<Transaction> {
    const [globalConfig] = this.getGlobalConfigPDA();

    const tx = await this.program.methods
      .initialize()
      .accounts({
        globalConfig,
        admin: params.admin,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return tx;
  }

  async createTask(params: CreateTaskParams): Promise<Transaction> {
    const [taskConfig] = this.getTaskConfigPDA(params.name);
    const [taskVault] = this.getTaskVaultPDA(params.name);

    const tx = await this.program.methods
      .createTask(params.name, params.lockedAmount)
      .accounts({
        taskConfig,
        creator: params.creator,
        taskVault,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return tx;
  }

  async submitRewardDistribution(params: SubmitRewardDistributionParams): Promise<Transaction> {
    const [taskConfig] = this.getTaskConfigPDA(params.taskName);

    const tx = await this.program.methods
      .submitRewardDistribution(
        params.taskName,
        params.recipients,
        params.amounts
      )
      .accounts({
        taskConfig,
        creator: params.creator,
      })
      .transaction();

    return tx;
  }

  async claimReward(params: ClaimRewardParams): Promise<Transaction> {
    const [taskConfig] = this.getTaskConfigPDA(params.taskName);
    const [taskVault] = this.getTaskVaultPDA(params.taskName);

    const tx = await this.program.methods
      .claimReward(params.taskName)
      .accounts({
        taskConfig,
        taskVault,
        claimer: params.claimer,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    return tx;
  }

  async getGlobalConfig(): Promise<any> {
    const [globalConfig] = this.getGlobalConfigPDA();
    try {
      return await (this.program.account as any).globalConfig.fetch(globalConfig);
    } catch {
      return null;
    }
  }

  async getTaskConfig(taskName: string): Promise<any> {
    const [taskConfig] = this.getTaskConfigPDA(taskName);
    try {
      return await (this.program.account as any).taskConfig.fetch(taskConfig);
    } catch {
      return null;
    }
  }

  getGlobalConfigAddress(): PublicKey {
    const [globalConfig] = this.getGlobalConfigPDA();
    return globalConfig;
  }

  getTaskConfigAddress(taskName: string): PublicKey {
    const [taskConfig] = this.getTaskConfigPDA(taskName);
    return taskConfig;
  }

  getTaskVaultAddress(taskName: string): PublicKey {
    const [taskVault] = this.getTaskVaultPDA(taskName);
    return taskVault;
  }
}