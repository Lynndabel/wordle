import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  wallet: ethers.BrowserProvider | null;
  account: string;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  account: "",
  isConnecting: false,
  error: null,
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globalThis.window?.ethereum) {
      const provider = new ethers.BrowserProvider(globalThis.window.ethereum);
      setWallet(provider);
      provider.send("eth_accounts", []).then(async (accounts) => {
        try {
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const addr = await signer.getAddress();
            setAccount(addr);
          }
        } catch (e) {
          // ignore on load, but log for debugging
          console.debug("wallet init signer error", e);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!globalThis.window?.ethereum) {
        throw new Error("No injected wallet found. Please install MetaMask or another EVM wallet.");
      }
      const provider = new ethers.BrowserProvider(globalThis.window.ethereum);
      await provider.send("eth_requestAccounts", []);
      let accounts = await provider.send("eth_accounts", []);

      // Fallback: request permissions if no accounts returned
      if (!accounts || accounts.length === 0) {
        try {
          await (globalThis.window as any)?.ethereum?.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          });
          accounts = await provider.send("eth_accounts", []);
        } catch (error_) {
          throw error_ as Error;
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts available. Create or import an account in your wallet and try again.");
      }

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      setWallet(provider);

      // Touch the network to ensure provider is ready
      await provider.getNetwork();
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
      alert("Wallet connection failed: " + msg);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, account, isConnecting, error, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  return useContext(WalletContext);
}
