import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

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

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
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
