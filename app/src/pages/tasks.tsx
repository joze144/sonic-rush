import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useSquadSDK } from '../hooks/useSquadSDK';
import { signAndSendTransaction } from '../utils/transaction';
import toast from 'react-hot-toast';

const LAMPORTS_PER_SOL = 1000000000;

export default function TasksPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const sdkPromise = useSquadSDK();

  const [sdk, setSdk] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Create task form state
  const [taskName, setTaskName] = useState('');
  const [lockedAmount, setLockedAmount] = useState('');

  // Submit reward distribution form state
  const [rewardTaskName, setRewardTaskName] = useState('');
  const [rewardRecipients, setRewardRecipients] = useState<string>('');
  const [rewardAmounts, setRewardAmounts] = useState<string>('');

  // Claim reward form state
  const [claimTaskName, setClaimTaskName] = useState('');
  
  // Task info state
  const [taskConfig, setTaskConfig] = useState<any>(null);
  const [searchTaskName, setSearchTaskName] = useState('');

  useEffect(() => {
    if (sdkPromise) {
      sdkPromise.then(setSdk);
    }
  }, [sdkPromise]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreateTask = async () => {
    if (!sdk || !wallet.publicKey) return;
    
    setLoading(true);
    clearMessages();

    try {
      const lockedAmountLamports = new BN(parseFloat(lockedAmount) * LAMPORTS_PER_SOL);

      const tx = await sdk.task.createTask({
        name: taskName,
        lockedAmount: lockedAmountLamports,
        creator: wallet.publicKey,
      });

      const result = await signAndSendTransaction(connection, tx, wallet);
      
      if (result.success) {
        setSuccess(`Task "${taskName}" created successfully! Transaction: ${result.signature}`);
        setTaskName('');
        setLockedAmount('');
      } else if (result.userRejected) {
        toast.error('Transaction rejected');
      } else {
        setError(`Failed to create task: ${result.error}`);
      }
    } catch (err) {
      setError(`Error creating task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const handleSubmitRewardDistribution = async () => {
    if (!sdk || !wallet.publicKey) return;
    
    setLoading(true);
    clearMessages();

    try {
      // Parse recipients and amounts
      const recipients = rewardRecipients
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0)
        .map(addr => new PublicKey(addr));

      const amounts = rewardAmounts
        .split('\n')
        .map(amount => amount.trim())
        .filter(amount => amount.length > 0)
        .map(amount => new BN(parseFloat(amount) * LAMPORTS_PER_SOL));

      if (recipients.length !== amounts.length) {
        throw new Error('Number of recipients must match number of amounts');
      }

      const tx = await sdk.task.submitRewardDistribution({
        taskName: rewardTaskName,
        recipients,
        amounts,
        creator: wallet.publicKey,
      });

      const result = await signAndSendTransaction(connection, tx, wallet);
      
      if (result.success) {
        setSuccess(`Reward distribution submitted for task "${rewardTaskName}"! Transaction: ${result.signature}`);
        setRewardTaskName('');
        setRewardRecipients('');
        setRewardAmounts('');
      } else if (result.userRejected) {
        toast.error('Transaction rejected');
      } else {
        setError(`Failed to submit reward distribution: ${result.error}`);
      }
    } catch (err) {
      setError(`Error submitting reward distribution: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const handleClaimReward = async () => {
    if (!sdk || !wallet.publicKey) return;
    
    setLoading(true);
    clearMessages();

    try {
      const tx = await sdk.task.claimReward({
        taskName: claimTaskName,
        claimer: wallet.publicKey,
      });

      const result = await signAndSendTransaction(connection, tx, wallet);
      
      if (result.success) {
        setSuccess(`Successfully claimed reward from task "${claimTaskName}"! Transaction: ${result.signature}`);
        setClaimTaskName('');
      } else if (result.userRejected) {
        toast.error('Transaction rejected');
      } else {
        setError(`Failed to claim reward: ${result.error}`);
      }
    } catch (err) {
      setError(`Error claiming reward: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const handleSearchTask = async () => {
    if (!sdk || !searchTaskName) return;
    
    setLoading(true);
    clearMessages();

    try {
      const config = await sdk.task.getTaskConfig(searchTaskName);
      setTaskConfig(config);
      
      if (!config) {
        setError(`Task "${searchTaskName}" not found`);
      }
    } catch (err) {
      setError(`Error searching task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  if (!wallet.connected) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Task & Rewards Management</h1>
        <p>Please connect your wallet to manage tasks and rewards.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Task & Rewards Management</h1>
      
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d1e7dd',
          border: '1px solid #badbcc',
          borderRadius: '8px',
          color: '#0f5132',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Create Task */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Create New Task</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Task Name:
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Locked Amount (SOL):
            </label>
            <input
              type="number"
              step="0.001"
              value={lockedAmount}
              onChange={(e) => setLockedAmount(e.target.value)}
              placeholder="Enter amount in SOL"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            onClick={handleCreateTask}
            disabled={loading || !taskName.trim() || !lockedAmount}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>

        {/* Claim Reward */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Claim Reward</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Task Name:
            </label>
            <input
              type="text"
              value={claimTaskName}
              onChange={(e) => setClaimTaskName(e.target.value)}
              placeholder="Enter task name to claim reward from"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            onClick={handleClaimReward}
            disabled={loading || !claimTaskName.trim()}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Claiming...' : 'Claim Reward'}
          </button>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
            Note: You can only claim rewards that have been distributed to your address.
          </p>
        </div>
      </div>

      {/* Submit Reward Distribution */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '2rem'
      }}>
        <h2>Submit Reward Distribution</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Task Name:
            </label>
            <input
              type="text"
              value={rewardTaskName}
              onChange={(e) => setRewardTaskName(e.target.value)}
              placeholder="Enter task name"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Recipient Addresses (one per line):
            </label>
            <textarea
              value={rewardRecipients}
              onChange={(e) => setRewardRecipients(e.target.value)}
              placeholder="Enter Solana addresses, one per line"
              rows={5}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Reward Amounts (SOL, one per line):
            </label>
            <textarea
              value={rewardAmounts}
              onChange={(e) => setRewardAmounts(e.target.value)}
              placeholder="Enter amounts in SOL, one per line"
              rows={5}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
        <button
          onClick={handleSubmitRewardDistribution}
          disabled={loading || !rewardTaskName.trim() || !rewardRecipients.trim() || !rewardAmounts.trim()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#6c757d' : '#ffc107',
            color: loading ? 'white' : '#212529',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Reward Distribution'}
        </button>
        <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
          Note: Make sure the number of recipients matches the number of amounts.
        </p>
      </div>

      {/* Task Info */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Task Information</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchTaskName}
            onChange={(e) => setSearchTaskName(e.target.value)}
            placeholder="Enter task name to search"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={handleSearchTask}
            disabled={loading || !searchTaskName.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#6c757d' : '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {taskConfig && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px'
          }}>
            <h3>Task: {searchTaskName}</h3>
            <p><strong>Creator:</strong> {taskConfig.creator?.toString()}</p>
            <p><strong>Locked Amount:</strong> {taskConfig.lockedAmount ? (taskConfig.lockedAmount.toNumber() / LAMPORTS_PER_SOL).toFixed(3) : '0'} SOL</p>
            <p><strong>Is Completed:</strong> {taskConfig.isCompleted ? 'Yes' : 'No'}</p>
            {taskConfig.recipients && taskConfig.recipients.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Recipients & Amounts</summary>
                <div style={{ marginTop: '0.5rem' }}>
                  {taskConfig.recipients.map((recipient: any, index: number) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.25rem 0',
                      fontFamily: 'monospace', 
                      fontSize: '0.9rem' 
                    }}>
                      <span>{recipient.toString()}</span>
                      <span>{taskConfig.amounts && taskConfig.amounts[index] ? 
                        (taskConfig.amounts[index].toNumber() / LAMPORTS_PER_SOL).toFixed(3) : '0'} SOL</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}