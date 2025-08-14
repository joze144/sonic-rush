import React, { FC, useMemo, useState } from 'react';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Toaster } from 'react-hot-toast';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            // Add any other wallets you want to support
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div style={{ 
                        minHeight: '100vh', 
                        display: 'flex', 
                        flexDirection: 'column',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <header className="navbar">
                            <div className="navbar-container">
                                <div className="navbar-brand">
                                    <Link href="/" style={{ textDecoration: 'none' }}>
                                        <h1 style={{ 
                                            color: '#2c3e50', 
                                            cursor: 'pointer',
                                            margin: 0,
                                            fontSize: '1.8rem'
                                        }}>
                                            Squad App
                                        </h1>
                                    </Link>
                                </div>

                                {/* Desktop Navigation */}
                                <nav className="navbar-nav desktop-nav">
                                    <Link 
                                        href="/squad" 
                                        style={{
                                            textDecoration: 'none',
                                            color: router.pathname === '/squad' ? '#007bff' : '#6c757d',
                                            fontWeight: router.pathname === '/squad' ? '600' : '500',
                                            fontSize: '1.1rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Squad
                                    </Link>
                                    <Link 
                                        href="/tasks" 
                                        style={{
                                            textDecoration: 'none',
                                            color: router.pathname === '/tasks' ? '#007bff' : '#6c757d',
                                            fontWeight: router.pathname === '/tasks' ? '600' : '500',
                                            fontSize: '1.1rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Tasks
                                    </Link>
                                </nav>

                                {/* Desktop Wallet Section */}
                                <div className="navbar-wallet desktop-wallet">
                                    <span style={{ 
                                        fontSize: '0.9rem', 
                                        color: '#6c757d',
                                        fontWeight: '500'
                                    }}>
                                        Devnet
                                    </span>
                                    <WalletMultiButton />
                                    <WalletDisconnectButton />
                                </div>

                                {/* Mobile Menu Button */}
                                <button 
                                    className="mobile-menu-button"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    style={{
                                        display: 'none',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        color: '#2c3e50'
                                    }}
                                >
                                    {isMobileMenuOpen ? '✕' : '☰'}
                                </button>
                            </div>

                            {/* Mobile Navigation Menu */}
                            <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
                                <Link 
                                    href="/squad" 
                                    style={{
                                        textDecoration: 'none',
                                        color: router.pathname === '/squad' ? '#007bff' : '#6c757d',
                                        fontWeight: router.pathname === '/squad' ? '600' : '500',
                                        fontSize: '1.1rem',
                                        padding: '1rem',
                                        display: 'block',
                                        borderBottom: '1px solid #e9ecef'
                                    }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Squad
                                </Link>
                                <Link 
                                    href="/tasks" 
                                    style={{
                                        textDecoration: 'none',
                                        color: router.pathname === '/tasks' ? '#007bff' : '#6c757d',
                                        fontWeight: router.pathname === '/tasks' ? '600' : '500',
                                        fontSize: '1.1rem',
                                        padding: '1rem',
                                        display: 'block',
                                        borderBottom: '1px solid #e9ecef'
                                    }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Tasks
                                </Link>
                                <div className="mobile-wallet">
                                    <span style={{ 
                                        fontSize: '0.9rem', 
                                        color: '#6c757d',
                                        fontWeight: '500',
                                        padding: '1rem',
                                        display: 'block'
                                    }}>
                                        Devnet
                                    </span>
                                    <div style={{ padding: '0 1rem 1rem' }}>
                                        <WalletMultiButton />
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <WalletDisconnectButton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main style={{ flex: 1, padding: '2rem' }}>
                            <Component {...pageProps} />
                        </main>
                    </div>
                    <Toaster 
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        }}
                    />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}