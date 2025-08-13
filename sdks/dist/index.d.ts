import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { SonicRushSDK } from './sonic-rush';
import { TaskSDK } from './task';
export interface SDKConfig {
    connection: Connection;
    provider?: AnchorProvider;
    sonicRushProgramId?: PublicKey;
    taskProgramId?: PublicKey;
}
export declare class SonicRushProjectSDK {
    sonicRush: SonicRushSDK;
    task: TaskSDK;
    connection: Connection;
    private constructor();
    static init(config: SDKConfig): Promise<SonicRushProjectSDK>;
    static getDefaultProgramIds(): {
        sonicRush: PublicKey;
        task: PublicKey;
    };
}
export * from './sonic-rush';
export * from './task';
export { SonicRushProjectSDK as default };
//# sourceMappingURL=index.d.ts.map