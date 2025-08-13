import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { connected } = useWallet();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Welcome to Squad</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#6c757d' }}>
                Create your own squad, join existing squads, and manage task rewards on Solana
            </p>
            
            {!connected ? (
                <div style={{ 
                    padding: '2rem', 
                    backgroundColor: '#fff3cd', 
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <h3>Connect Your Wallet</h3>
                    <p>Please connect your Solana wallet to get started</p>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    <Link href="/squad" className="btn btn-primary" style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        padding: '1.5rem 2rem'
                    }}>
                        Squad Management
                    </Link>
                    <Link href="/tasks" className="btn btn-success" style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        padding: '1.5rem 2rem'
                    }}>
                        Task & Rewards
                    </Link>
                </div>
            )}
            
            <div style={{ marginTop: '4rem', textAlign: 'left' }}>
                <h2>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3>Squad Management</h3>
                        <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                            <li>Create your own squad</li>
                            <li>Whitelist member addresses</li>
                            <li>Join existing squads</li>
                            <li>Claim SPL tokens if whitelisted</li>
                        </ul>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3>Task Rewards</h3>
                        <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                            <li>Create tasks for your squad</li>
                            <li>Submit reward distributions</li>
                            <li>Claim rewards for completed tasks</li>
                            <li>Track task completion status</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}