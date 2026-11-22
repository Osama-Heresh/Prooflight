"use client";

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      // Mock connection logic
      if (typeof window.ethereum !== 'undefined') {
        // Simulate MetaMask connection
        // In a real app: const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // setWalletAddress(accounts[0]);
        setTimeout(() => {
          const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
          setWalletAddress(mockAddress);
          setIsConnected(true);
          toast({
            title: "Wallet Connected",
            description: `Connected with address: ${mockAddress.substring(0,6)}...${mockAddress.substring(mockAddress.length-4)}`,
          });
        }, 500);
      } else {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting your wallet.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
    });
  };

  if (isConnected && walletAddress) {
    return (
      <Button variant="outline" onClick={handleDisconnect}>
        <Wallet className="mr-2 h-4 w-4" />
        {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
