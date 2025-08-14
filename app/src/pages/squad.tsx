import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useSquadSDK } from '../hooks/useSquadSDK';
import { signAndSendTransaction } from '../utils/transaction';
import toast from 'react-hot-toast';

export default function SquadPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const sdkPromise = useSquadSDK();

  const [sdk, setSdk] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Create squad form state
  const [squadName, setSquadName] = useState('');
  const [memberAddresses, setMemberAddresses] = useState<string>('');

  // Join squad form state
  const [joinSquadName, setJoinSquadName] = useState('');
  
  // Squad info state
  const [squadConfig, setSquadConfig] = useState<any>(null);
  const [searchSquadName, setSearchSquadName] = useState('');

  useEffect(() => {
    if (sdkPromise) {
      sdkPromise.then(setSdk);
    }
  }, [sdkPromise]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreateSquad = async () => {
    if (!sdk || !wallet.publicKey) return;
    
    setLoading(true);
    clearMessages();

    try {
      // Parse member addresses
      const members = memberAddresses
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0)
        .map(addr => new PublicKey(addr));

      const tx = await sdk.squad.initialize({
        name: squadName,
        members,
        feeAndRentPayer: wallet.publicKey,
        mainSigningAuthority: wallet.publicKey,
      });

      const result = await signAndSendTransaction(connection, tx, wallet);
      
      if (result.success) {
        setSuccess(`Squad "${squadName}" created successfully! Transaction: ${result.signature}`);
        setSquadName('');
        setMemberAddresses('');
      } else if (result.userRejected) {
        toast.error('Transaction rejected');
      } else {
        setError(`Failed to create squad: ${result.error}`);
      }
    } catch (err) {
      setError(`Error creating squad: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const handleJoinSquad = async () => {
    if (!sdk || !wallet.publicKey) return;
    
    setLoading(true);
    clearMessages();

    try {
      const tx = await sdk.squad.claimToken({
        groupName: joinSquadName,
        claimer: wallet.publicKey,
      });

      const result = await signAndSendTransaction(connection, tx, wallet);
      
      if (result.success) {
        setSuccess(`Successfully joined squad "${joinSquadName}"! Transaction: ${result.signature}`);
        setJoinSquadName('');
      } else if (result.userRejected) {
        toast.error('Transaction rejected');
      } else {
        setError(`Failed to join squad: ${result.error}`);
      }
    } catch (err) {
      setError(`Error joining squad: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const handleSearchSquad = async () => {
    if (!sdk || !searchSquadName) return;
    
    setLoading(true);
    clearMessages();

    try {
      const config = await sdk.squad.getGroupConfig(searchSquadName);
      setSquadConfig(config);
      
      if (!config) {
        setError(`Squad "${searchSquadName}" not found`);
      }
    } catch (err) {
      setError(`Error searching squad: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  if (!wallet.connected) {
    return (
      <div className="wallet-warning">
        <h1>Squad Management</h1>
        <p>Please connect your wallet to manage squads.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Squad Management</h1>
      
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
        {/* Create Squad */}
        <div className="page-section">
          <h2>Create New Squad</h2>
          <div className="form-group">
            <label className="form-label">
              Squad Name:
            </label>
            <input
              type="text"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="Enter squad name"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Member Addresses (one per line):
            </label>
            <textarea
              value={memberAddresses}
              onChange={(e) => setMemberAddresses(e.target.value)}
              placeholder="Enter Solana addresses, one per line"
              rows={5}
              className="form-textarea"
            />
          </div>
          <button
            onClick={handleCreateSquad}
            disabled={loading || !squadName.trim()}
            className={`btn ${loading || !squadName.trim() ? '' : 'btn-primary'}`}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating...' : 'Create Squad'}
          </button>
        </div>

        {/* Join Squad */}
        <div className="page-section">
          <h2>Join Existing Squad</h2>
          <div className="form-group">
            <label className="form-label">
              Squad Name:
            </label>
            <input
              type="text"
              value={joinSquadName}
              onChange={(e) => setJoinSquadName(e.target.value)}
              placeholder="Enter squad name to join"
              className="form-input"
            />
          </div>
          <button
            onClick={handleJoinSquad}
            disabled={loading || !joinSquadName.trim()}
            className={`btn ${loading || !joinSquadName.trim() ? '' : 'btn-success'}`}
            style={{ width: '100%' }}
          >
            {loading ? 'Joining...' : 'Join Squad & Claim Token'}
          </button>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
            Note: You can only join if your wallet address is whitelisted by the squad creator.
          </p>
        </div>
      </div>

      {/* Squad Info */}
      <div className="page-section">
        <h2>Squad Information</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchSquadName}
            onChange={(e) => setSearchSquadName(e.target.value)}
            placeholder="Enter squad name to search"
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSearchSquad}
            disabled={loading || !searchSquadName.trim()}
            className={`btn ${loading || !searchSquadName.trim() ? '' : 'btn-purple'}`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {squadConfig && (
          <div style={{
            padding: '1rem',
            background: 'rgba(50, 255, 220, 0.1)',
            border: '1px solid rgba(50, 255, 220, 0.3)',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#32FFDC', marginBottom: '1rem' }}>Squad: {searchSquadName}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Creator:</strong> {squadConfig.mainSigningAuthority?.toString()}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Members:</strong> {squadConfig.members?.length || 0}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}><strong>Token Mint:</strong> {squadConfig.groupTokenMint?.toString()}</p>
            {squadConfig.members && squadConfig.members.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#32FFDC' }}>View Members</summary>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {squadConfig.members.map((member: any, index: number) => (
                    <li key={index} style={{ 
                      fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', 
                      fontSize: '0.85rem', 
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '0.25rem'
                    }}>
                      {member.toString()}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}