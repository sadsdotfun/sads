import { useWalletContext } from '@/lib/privy';

export function useWallet() {
  return useWalletContext();
}
