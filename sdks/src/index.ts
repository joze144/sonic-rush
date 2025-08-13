import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { SquadSDK } from './squad';
import { TaskSDK } from './task';

import squadIdl from '../../target/idl/squad.json';
import taskIdl from '../../target/idl/task.json';

export interface SDKConfig {
  connection: Connection;
  provider?: AnchorProvider;
  squadProgramId?: PublicKey;
  taskProgramId?: PublicKey;
}

export class SquadProjectSDK {
  public squad: SquadSDK;
  public task: TaskSDK;
  public connection: Connection;
  
  private constructor(
    connection: Connection,
    squadSDK: SquadSDK,
    taskSDK: TaskSDK
  ) {
    this.connection = connection;
    this.squad = squadSDK;
    this.task = taskSDK;
  }

  static async init(config: SDKConfig): Promise<SquadProjectSDK> {
    const { connection, provider } = config;
    
    const squadProgramId = config.squadProgramId || 
      new PublicKey(squadIdl.address);
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

    const squadProgram = new Program(
      squadIdl as any,
      anchorProvider
    );

    const taskProgram = new Program(
      taskIdl as any,
      anchorProvider
    );

    const squadSDK = new SquadSDK(squadProgram, squadProgramId);
    const taskSDK = new TaskSDK(taskProgram, taskProgramId);

    return new SquadProjectSDK(connection, squadSDK, taskSDK);
  }

  static getDefaultProgramIds() {
    return {
      squad: new PublicKey(squadIdl.address),
      task: new PublicKey(taskIdl.address),
    };
  }
}

export * from './squad';
export * from './task';
export { SquadProjectSDK as default };