import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { web3Service } from '../utils/web3';
import { CONTRACT_ADDRESSES } from '../utils/contracts';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  balance: string;
  tokenBalance: string;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  addTokenToMetaMask: () => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTokenToMetaMask = async () => {
    if (!window.ethereum || !CONTRACT_ADDRESSES.TOKEN) {
      throw new Error('MetaMask not found or contracts not deployed');
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT_ADDRESSES.TOKEN,
            symbol: 'OSS',
            decimals: 18,
            image: '', // You can add a token logo URL here
          },
        },
      });

      if (wasAdded) {
        console.log('OSS token added to MetaMask!');
        // Refresh balances after adding token
        await refreshBalances();
      }
    } catch (error) {
      console.error('Failed to add token to MetaMask:', error);
      throw error;
    }
  };

  const refreshBalances = async () => {
    if (!account) return;
    
    try {
      const ethBalance = await web3Service.getBalance(account);
      setBalance(ethBalance);
      
      if (CONTRACT_ADDRESSES.TOKEN) {
        const ossTokenBalance = await web3Service.getTokenBalance(account);
        setTokenBalance(ossTokenBalance);
      }
    } catch (err) {
      console.error('Failed to refresh balances:', err);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const address = await web3Service.connectWallet();
      setAccount(address);
      setIsConnected(true);
      
      // Get ETH balance
      const ethBalance = await web3Service.getBalance(address);
      setBalance(ethBalance);
      
      // Get OSS token balance if contracts are deployed
      if (CONTRACT_ADDRESSES.TOKEN) {
        const ossTokenBalance = await web3Service.getTokenBalance(address);
        setTokenBalance(ossTokenBalance);
        
        // Automatically prompt to add token to MetaMask
        try {
          await addTokenToMetaMask();
        } catch (err) {
          console.log('User declined to add token to MetaMask');
        }
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to connect wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setBalance('0');
    setTokenBalance('0');
    setError(null);
  };

  // Update balances periodically
  useEffect(() => {
    if (isConnected && account) {
      // Update every 30 seconds
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, account]);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          console.error('Failed to check existing connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value = {
    isConnected,
    account,
    balance,
    tokenBalance,
    isLoading,
    error,
    connectWallet,
    disconnect,
    addTokenToMetaMask,
    refreshBalances,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 