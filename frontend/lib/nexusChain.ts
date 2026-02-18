import { defineChain } from 'viem'

export const nexusTestnet = defineChain({
  id: 3945,
  name: 'Nexus Layer 1 Testnet III',
  nativeCurrency: {
    decimals: 18,
    name: 'NEX',
    symbol: 'NEX',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_NEXUS_RPC_URL || 'https://testnet.rpc.nexus.xyz'],
      webSocket: [process.env.NEXT_PUBLIC_NEXUS_WS_URL || 'wss://testnet.rpc.nexus.xyz'],
    },
    public: {
      http: ['https://testnet.rpc.nexus.xyz'],
      webSocket: ['wss://testnet.rpc.nexus.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Nexus Explorer',
      url: process.env.NEXT_PUBLIC_NEXUS_EXPLORER_URL || 'https://nexus.testnet.blockscout.com',
    },
  },
  testnet: true,
})
