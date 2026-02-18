'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { nexusTestnet } from '@/lib/nexusChain'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'
import { ReactNode } from 'react'

const config = createConfig({
  chains: [nexusTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [nexusTestnet.id]: http(),
  },
})

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
