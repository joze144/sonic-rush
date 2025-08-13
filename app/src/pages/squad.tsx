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
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Squad Management</h1>
        <p>Please connect your wallet to manage squads.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Squad Management</h1>
      
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
        {/* Create Squad */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Create New Squad</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Squad Name:
            </label>
            <input
              type="text"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="Enter squad name"
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
              Member Addresses (one per line):
            </label>
            <textarea
              value={memberAddresses}
              onChange={(e) => setMemberAddresses(e.target.value)}
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
          <button
            onClick={handleCreateSquad}
            disabled={loading || !squadName.trim()}
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
            {loading ? 'Creating...' : 'Create Squad'}
          </button>
        </div>

        {/* Join Squad */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Join Existing Squad</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Squad Name:
            </label>
            <input
              type="text"
              value={joinSquadName}
              onChange={(e) => setJoinSquadName(e.target.value)}
              placeholder="Enter squad name to join"
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
            onClick={handleJoinSquad}
            disabled={loading || !joinSquadName.trim()}
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
            {loading ? 'Joining...' : 'Join Squad & Claim Token'}
          </button>
          <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
            Note: You can only join if your wallet address is whitelisted by the squad creator.
          </p>
        </div>
      </div>

      {/* Squad Info */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h2>Squad Information</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchSquadName}
            onChange={(e) => setSearchSquadName(e.target.value)}
            placeholder="Enter squad name to search"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={handleSearchSquad}
            disabled={loading || !searchSquadName.trim()}
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

        {squadConfig && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px'
          }}>
            <h3>Squad: {searchSquadName}</h3>
            <p><strong>Creator:</strong> {squadConfig.mainSigningAuthority?.toString()}</p>
            <p><strong>Members:</strong> {squadConfig.members?.length || 0}</p>
            <p><strong>Token Mint:</strong> {squadConfig.groupTokenMint?.toString()}</p>
            {squadConfig.members && squadConfig.members.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Members</summary>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {squadConfig.members.map((member: any, index: number) => (
                    <li key={index} style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
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