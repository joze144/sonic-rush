import { PublicKey, Transaction } from '@solana/web3.js';
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
export declare class TaskSDK {
    private program;
    private programId;
    constructor(program: any, programId: PublicKey);
    private getGlobalConfigPDA;
    private getTaskConfigPDA;
    private getTaskVaultPDA;
    initialize(params: InitializeTaskProgramParams): Promise<Transaction>;
    createTask(params: CreateTaskParams): Promise<Transaction>;
    submitRewardDistribution(params: SubmitRewardDistributionParams): Promise<Transaction>;
    claimReward(params: ClaimRewardParams): Promise<Transaction>;
    getGlobalConfig(): Promise<any>;
    getTaskConfig(taskName: string): Promise<any>;
    getGlobalConfigAddress(): PublicKey;
    getTaskConfigAddress(taskName: string): PublicKey;
    getTaskVaultAddress(taskName: string): PublicKey;
}
//# sourceMappingURL=task.d.ts.map