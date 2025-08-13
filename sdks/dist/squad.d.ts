import { PublicKey, Transaction } from '@solana/web3.js';
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
export declare class SquadSDK {
    private program;
    private programId;
    constructor(program: any, programId: PublicKey);
    private getConfigPDA;
    private getGroupTokenMintPDA;
    initialize(params: InitializeParams): Promise<Transaction>;
    claimToken(params: ClaimTokenParams): Promise<Transaction>;
    getGroupConfig(groupName: string): Promise<any>;
    getConfigAddress(groupName: string): PublicKey;
    getGroupTokenMintAddress(groupName: string): PublicKey;
}
//# sourceMappingURL=squad.d.ts.map