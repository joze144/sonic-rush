import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { SquadSDK } from './squad';
import { TaskSDK } from './task';
export interface SDKConfig {
    connection: Connection;
    provider?: AnchorProvider;
    squadProgramId?: PublicKey;
    taskProgramId?: PublicKey;
}
export declare class SquadProjectSDK {
    squad: SquadSDK;
    task: TaskSDK;
    connection: Connection;
    private constructor();
    static init(config: SDKConfig): Promise<SquadProjectSDK>;
    static getDefaultProgramIds(): {
        squad: PublicKey;
        task: PublicKey;
    };
}
export * from './squad';
export * from './task';
export { SquadProjectSDK as default };
//# sourceMappingURL=index.d.ts.map