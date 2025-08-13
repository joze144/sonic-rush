import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { SonicRushSDK } from './sonic-rush';
import { TaskSDK } from './task';

import sonicRushIdl from '../../target/idl/sonic_rush.json';
import taskIdl from '../../target/idl/task.json';

export interface SDKConfig {
  connection: Connection;
  provider?: AnchorProvider;
  sonicRushProgramId?: PublicKey;
  taskProgramId?: PublicKey;
}

export class SonicRushProjectSDK {
  public sonicRush: SonicRushSDK;
  public task: TaskSDK;
  public connection: Connection;
  
  private constructor(
    connection: Connection,
    sonicRushSDK: SonicRushSDK,
    taskSDK: TaskSDK
  ) {
    this.connection = connection;
    this.sonicRush = sonicRushSDK;
    this.task = taskSDK;
  }

  static async init(config: SDKConfig): Promise<SonicRushProjectSDK> {
    const { connection, provider } = config;
    
    const sonicRushProgramId = config.sonicRushProgramId || 
      new PublicKey(sonicRushIdl.address);
    const taskProgramId = config.taskProgramId || 
      new PublicKey(taskIdl.address);

    let anchorProvider: AnchorProvider;
    if (provider) {
      anchorProvider = provider;
    } else {
      // Create a dummy provider for read-only operations
      anchorProvider = {
        connection,
        publicKey: PublicKey.default,
      } as any;
    }

    const sonicRushProgram = new Program(
      sonicRushIdl as any,
      anchorProvider
    );

    const taskProgram = new Program(
      taskIdl as any,
      anchorProvider
    );

    const sonicRushSDK = new SonicRushSDK(sonicRushProgram, sonicRushProgramId);
    const taskSDK = new TaskSDK(taskProgram, taskProgramId);

    return new SonicRushProjectSDK(connection, sonicRushSDK, taskSDK);
  }

  static getDefaultProgramIds() {
    return {
      sonicRush: new PublicKey(sonicRushIdl.address),
      task: new PublicKey(taskIdl.address),
    };
  }
}

export * from './sonic-rush';
export * from './task';
export { SonicRushProjectSDK as default };