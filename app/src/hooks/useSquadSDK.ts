import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useMemo } from 'react';
import { SquadProjectSDK } from '@squad/sdk';

export function useSquadSDK() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const sdk = useMemo(() => {
    if (!connection) return null;

    let provider: AnchorProvider | undefined;
    
    if (wallet.publicKey && wallet.signTransaction && wallet.signAllTransactions) {
      provider = new AnchorProvider(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction.bind(wallet),
          signAllTransactions: wallet.signAllTransactions.bind(wallet),
        } as any,
        {
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
        }
      );
    }

    return SquadProjectSDK.init({
      connection,
      provider,
    });
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);

  return sdk;
}