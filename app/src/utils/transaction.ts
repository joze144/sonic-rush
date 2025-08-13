import { Connection, Transaction, SendOptions } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
  userRejected?: boolean;
}

export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction,
  wallet: WalletContextState,
  options: SendOptions = { skipPreflight: false, preflightCommitment: 'confirmed' }
): Promise<TransactionResult> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send the transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      options
    );

    // Confirm the transaction
    const confirmation = await connection.confirmTransaction(
      signature,
      'confirmed'
    );

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`);
    }

    return {
      signature,
      success: true,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    
    // Check if user rejected the transaction
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isUserRejection = 
      errorMessage.includes('User rejected') ||
      errorMessage.includes('user rejected') ||
      errorMessage.includes('cancelled') ||
      errorMessage.includes('4001') ||
      errorMessage.includes('denied by user') ||
      errorMessage.includes('Transaction was not confirmed');
    
    return {
      signature: '',
      success: false,
      error: errorMessage,
      userRejected: isUserRejection,
    };
  }
}