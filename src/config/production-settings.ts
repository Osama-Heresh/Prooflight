
/**
 * @fileOverview Placeholder for production-specific application settings.
 * 
 * In a real production environment, many of these values would come from 
 * environment variables (process.env.PROOFLIGHT_...) to keep secrets out of the codebase.
 * This file can serve as a fallback or for settings that are not sensitive.
 * 
 * Refer to `.env.example` for a list of common environment variables.
 * The admin "Production Setup Guide" page provides context on these settings.
 */

export interface ProductionSettings {
  siteUrl: string;
  blockchain: {
    networkName: string; // e.g., 'Polygon Mainnet', 'Sepolia Testnet'
    rpcUrl: string; // From environment variable
    nftContractAddress: string; // From environment variable or hardcoded if public testnet
  };
  ipfs: {
    gatewayUrl: string; // e.g., 'https://ipfs.io/ipfs/' or your custom gateway
    // API keys for pinning services would be in environment variables
  };
  payments?: {
    receiverAddress?: string; // Site owner's wallet address for payments
  };
  // Add other non-sensitive production configurations here
}

// EXAMPLE Placeholder values - REPLACE WITH YOUR ACTUAL PRODUCTION CONFIGURATION
// It's highly recommended to source sensitive values like rpcUrl and contractAddress 
// from environment variables in a real deployment.
export const productionSettings: ProductionSettings = {
  siteUrl: process.env.PROOFLIGHT_SITE_URL || 'https://example.com',
  blockchain: {
    networkName: process.env.PROOFLIGHT_BLOCKCHAIN_NETWORK_NAME || 'Sepolia Testnet', // Default to a testnet
    rpcUrl: process.env.PROOFLIGHT_RPC_URL || 'YOUR_RPC_URL_FROM_ENV_OR_HARDCODE_FOR_TESTNET',
    nftContractAddress: process.env.PROOFLIGHT_NFT_CONTRACT_ADDRESS || 'YOUR_NFT_CONTRACT_ADDRESS_FROM_ENV_OR_HARDCODE_FOR_TESTNET',
  },
  ipfs: {
    gatewayUrl: 'https://ipfs.io/ipfs/',
  },
  payments: {
    receiverAddress: process.env.PROOFLIGHT_PAYMENT_RECEIVER_ADDRESS || undefined,
  },
};

// How to use in your application (example):
// import { productionSettings } from '@/config/production-settings';
// console.log(productionSettings.siteUrl);
// console.log(productionSettings.blockchain.rpcUrl);
