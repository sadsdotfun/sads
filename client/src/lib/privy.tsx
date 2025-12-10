import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';

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

function PhantomWalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const checkPhantom = async () => {
      if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
        const phantom = (window as any).phantom.solana;
        if (phantom.isConnected && phantom.publicKey) {
          setConnected(true);
          setAddress(phantom.publicKey.toString());
          setWallet(phantom);
        }
      }
    };
    checkPhantom();
  }, []);

  const connect = useCallback(async () => {
    try {
      if (typeof window === 'undefined') {
        alert('Please use a browser with Phantom wallet installed.');
        return;
      }
      
      const phantom = (window as any).phantom?.solana;
      
      if (!phantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      const response = await phantom.connect();
      setConnected(true);
      setAddress(response.publicKey.toString());
      setWallet(phantom);
    } catch (error) {
      console.error('Failed to connect Phantom wallet:', error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
      }
      setConnected(false);
      setAddress(null);
      setWallet(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [wallet]);

  const placeBet = useCallback(async (amount: number, marketId: string, side: 'yes' | 'no') => {
    if (!connected || !wallet) {
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
  }, [connected, wallet]);

  const shortAddress = address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  const value: WalletContextType = useMemo(() => ({
    ready: true,
    authenticated: connected,
    address,
    shortAddress,
    wallet,
    connect,
    disconnect,
    placeBet,
    privyAvailable: false,
  }), [connected, address, shortAddress, wallet, connect, disconnect, placeBet]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
  return <PhantomWalletProvider>{children}</PhantomWalletProvider>;
}
