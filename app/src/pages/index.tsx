import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { connected } = useWallet();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Build Your Squad on <span className="highlight">Solana</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create decentralized teams, manage token rewards, and coordinate tasks with your community on the Solana blockchain.
                    </p>
                    
                    {!connected ? (
                        <div className="wallet-prompt">
                            <h3>🔗 Connect Your Wallet</h3>
                            <p>Please connect your Solana wallet to get started with Squad</p>
                        </div>
                    ) : (
                        <div className="hero-actions">
                            <Link href="/squad" className="btn btn-primary">
                                Launch Squad
                            </Link>
                            <Link href="/tasks" className="btn btn-secondary">
                                Manage Tasks
                            </Link>
                        </div>
                    )}
                </div>
                
                {/* Animated background elements */}
                <div className="hero-bg">
                    <div className="floating-element element-1"></div>
                    <div className="floating-element element-2"></div>
                    <div className="floating-element element-3"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Powerful Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Squad Management</h3>
                        <ul className="feature-list">
                            <li>Create and customize your squad</li>
                            <li>Whitelist member addresses</li>
                            <li>Join existing squads</li>
                            <li>Claim SPL tokens seamlessly</li>
                        </ul>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Task & Rewards</h3>
                        <ul className="feature-list">
                            <li>Create tasks for your squad</li>
                            <li>Submit reward distributions</li>
                            <li>Claim rewards automatically</li>
                            <li>Track completion status</li>
                        </ul>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Solana Powered</h3>
                        <ul className="feature-list">
                            <li>Lightning-fast transactions</li>
                            <li>Low transaction fees</li>
                            <li>Secure blockchain technology</li>
                            <li>Decentralized governance</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">1000+</div>
                        <div className="stat-label">Active Squads</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">50K+</div>
                        <div className="stat-label">Tasks Completed</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">$2M+</div>
                        <div className="stat-label">Rewards Distributed</div>
                    </div>
                </div>
            </section>
        </div>
    );
}