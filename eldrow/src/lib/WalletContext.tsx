import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  wallet: ethers.BrowserProvider | null;
  account: string;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  account: "",
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    if (globalThis.window?.ethereum) {
      const provider = new ethers.BrowserProvider(globalThis.window.ethereum);
      setWallet(provider);
      provider.send("eth_accounts", []).then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (globalThis.window?.ethereum) {
        const provider = new ethers.BrowserProvider(globalThis.window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.send("eth_accounts", []);
        setAccount(accounts[0]);
        setWallet(provider);
      }
    } catch (err) {
      alert("Wallet connection failed: " + (err as Error).message);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  return useContext(WalletContext);
}
