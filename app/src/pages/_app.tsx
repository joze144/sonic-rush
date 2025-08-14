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
                        flexDirection: 'column'
                    }}>
                        <header className="navbar">
                            <div className="navbar-container">
                                <div className="navbar-brand">
                                    <Link href="/" style={{ textDecoration: 'none' }}>
                                        <h1 style={{ 
                                            cursor: 'pointer',
                                            margin: 0,
                                            fontSize: '1.8rem'
                                        }}>
                                            Squad
                                        </h1>
                                    </Link>
                                </div>

                                {/* Desktop Navigation */}
                                <nav className="navbar-nav desktop-nav">
                                    <Link 
                                        href="/squad" 
                                        className={router.pathname === '/squad' ? 'active' : ''}
                                    >
                                        Squad
                                    </Link>
                                    <Link 
                                        href="/tasks" 
                                        className={router.pathname === '/tasks' ? 'active' : ''}
                                    >
                                        Tasks
                                    </Link>
                                </nav>

                                {/* Desktop Wallet Section */}
                                <div className="navbar-wallet desktop-wallet">
                                    <span>Devnet</span>
                                    <WalletMultiButton />
                                    <WalletDisconnectButton />
                                </div>

                                {/* Mobile Menu Button */}
                                <button 
                                    className="mobile-menu-button"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    style={{
                                        display: 'none',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0.75rem'
                                    }}
                                >
                                    {isMobileMenuOpen ? '✕' : '☰'}
                                </button>
                            </div>

                            {/* Mobile Navigation Menu */}
                            <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
                                <Link 
                                    href="/squad" 
                                    className={`mobile-nav-link ${router.pathname === '/squad' ? 'active' : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Squad
                                </Link>
                                <Link 
                                    href="/tasks" 
                                    className={`mobile-nav-link ${router.pathname === '/tasks' ? 'active' : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Tasks
                                </Link>
                                <div className="mobile-wallet">
                                    <span className="mobile-wallet-badge">Devnet</span>
                                    <div className="mobile-wallet-buttons">
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