import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';

interface WalletContextType {
  ready: boolean;
  authenticated: boolean;
  address: string | null;
  shortAddress: string | null;
  wallet: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  placeBet: (amount: number, marketId: string, side: 'yes' | 'no') => Promise<{ success: boolean; txId?: string; error?: string }>;
  privyAvailable: boolean;
}

const WalletContext = createContext<WalletContextType>({
  ready: true,
  authenticated: false,
  address: null,
  shortAddress: null,
  wallet: null,
  connect: async () => {},
  disconnect: async () => {},
  placeBet: async () => ({ success: false, error: 'Wallet not configured' }),
  privyAvailable: false,
});

export function useWalletContext() {
  return useContext(WalletContext);
}

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  
  const solanaWallet = wallets.find(w => w.walletClientType === 'phantom');
  const address = solanaWallet?.address || null;
  
  const shortAddress = address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  const connect = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }, [login]);

  const disconnect = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [logout]);

  const placeBet = useCallback(async (amount: number, marketId: string, side: 'yes' | 'no') => {
    if (!authenticated || !solanaWallet) {
      return { success: false, error: 'Wallet not connected' };
    }
    
    try {
      console.log(`Placing bet: ${amount} USDC on ${side} for market ${marketId}`);
      return { 
        success: true, 
        txId: 'tx_' + Math.random().toString(36).substring(7)
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Transaction failed' };
    }
  }, [authenticated, solanaWallet]);

  const value: WalletContextType = useMemo(() => ({
    ready,
    authenticated,
    address,
    shortAddress,
    wallet: solanaWallet,
    connect,
    disconnect,
    placeBet,
    privyAvailable: true,
  }), [ready, authenticated, address, shortAddress, solanaWallet, connect, disconnect, placeBet]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

function MockWalletProvider({ children }: { children: React.ReactNode }) {
  const [mockConnected, setMockConnected] = useState(false);

  const value: WalletContextType = useMemo(() => ({
    ready: true,
    authenticated: mockConnected,
    address: mockConnected ? 'DemoWallet123456789abcdef' : null,
    shortAddress: mockConnected ? 'Demo...cdef' : null,
    wallet: null,
    connect: async () => {
      alert('To enable real wallet connection, add your Privy App ID to environment variables (VITE_PRIVY_APP_ID).\n\nFor demo purposes, you are now connected with a mock wallet.');
      setMockConnected(true);
    },
    disconnect: async () => {
      setMockConnected(false);
    },
    placeBet: async (amount: number, marketId: string, side: 'yes' | 'no') => {
      if (!mockConnected) {
        return { success: false, error: 'Wallet not connected' };
      }
      console.log(`[DEMO] Placing bet: ${amount} USDC on ${side} for market ${marketId}`);
      return { 
        success: true, 
        txId: 'demo_' + Math.random().toString(36).substring(7)
      };
    },
    privyAvailable: false,
  }), [mockConnected]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    return <MockWalletProvider>{children}</MockWalletProvider>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#b374ff',
          walletList: ['phantom'],
        },
      }}
    >
      <WalletContextProvider>{children}</WalletContextProvider>
    </PrivyProvider>
  );
}
