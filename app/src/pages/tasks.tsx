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
      <div className="wallet-warning">
        <h1>Task & Rewards Management</h1>
        <p>Please connect your wallet to manage tasks and rewards.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Task & Rewards Management</h1>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="page-grid">
        {/* Create Task */}
        <div className="page-section">
          <h2>Create New Task</h2>
          <div className="form-group">
            <label className="form-label">
              Task Name:
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Locked Amount (SOL):
            </label>
            <input
              type="number"
              step="0.001"
              value={lockedAmount}
              onChange={(e) => setLockedAmount(e.target.value)}
              placeholder="Enter amount in SOL"
              className="form-input"
            />
          </div>
          <button
            onClick={handleCreateTask}
            disabled={loading || !taskName.trim() || !lockedAmount}
            className={`btn ${loading || !taskName.trim() || !lockedAmount ? '' : 'btn-primary'}`}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>

        {/* Claim Reward */}
        <div className="page-section">
          <h2>Claim Reward</h2>
          <div className="form-group">
            <label className="form-label">
              Task Name:
            </label>
            <input
              type="text"
              value={claimTaskName}
              onChange={(e) => setClaimTaskName(e.target.value)}
              placeholder="Enter task name to claim reward from"
              className="form-input"
            />
          </div>
          <button
            onClick={handleClaimReward}
            disabled={loading || !claimTaskName.trim()}
            className={`btn ${loading || !claimTaskName.trim() ? '' : 'btn-success'}`}
            style={{ width: '100%' }}
          >
            {loading ? 'Claiming...' : 'Claim Reward'}
          </button>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
            Note: You can only claim rewards that have been distributed to your address.
          </p>
        </div>
      </div>

      {/* Submit Reward Distribution */}
      <div className="page-section" style={{ marginBottom: '2rem' }}>
        <h2>Submit Reward Distribution</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Task Name:
            </label>
            <input
              type="text"
              value={rewardTaskName}
              onChange={(e) => setRewardTaskName(e.target.value)}
              placeholder="Enter task name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Recipient Addresses (one per line):
            </label>
            <textarea
              value={rewardRecipients}
              onChange={(e) => setRewardRecipients(e.target.value)}
              placeholder="Enter Solana addresses, one per line"
              rows={5}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Reward Amounts (SOL, one per line):
            </label>
            <textarea
              value={rewardAmounts}
              onChange={(e) => setRewardAmounts(e.target.value)}
              placeholder="Enter amounts in SOL, one per line"
              rows={5}
              className="form-textarea"
            />
          </div>
        </div>
        <button
          onClick={handleSubmitRewardDistribution}
          disabled={loading || !rewardTaskName.trim() || !rewardRecipients.trim() || !rewardAmounts.trim()}
          className={`btn ${loading || !rewardTaskName.trim() || !rewardRecipients.trim() || !rewardAmounts.trim() ? '' : 'btn-warning'}`}
          style={{ width: '100%' }}
        >
          {loading ? 'Submitting...' : 'Submit Reward Distribution'}
        </button>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
          Note: Make sure the number of recipients matches the number of amounts.
        </p>
      </div>

      {/* Task Info */}
      <div className="page-section">
        <h2>Task Information</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchTaskName}
            onChange={(e) => setSearchTaskName(e.target.value)}
            placeholder="Enter task name to search"
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSearchTask}
            disabled={loading || !searchTaskName.trim()}
            className={`btn ${loading || !searchTaskName.trim() ? '' : 'btn-purple'}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {taskConfig && (
          <div style={{
            padding: '1rem',
            background: 'rgba(50, 255, 220, 0.1)',
            border: '1px solid rgba(50, 255, 220, 0.3)',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#32FFDC', marginBottom: '1rem' }}>Task: {searchTaskName}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Creator:</strong> {taskConfig.creator?.toString()}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Locked Amount:</strong> {taskConfig.lockedAmount ? (taskConfig.lockedAmount.toNumber() / LAMPORTS_PER_SOL).toFixed(3) : '0'} SOL</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Is Completed:</strong> {taskConfig.isCompleted ? 'Yes' : 'No'}</p>
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