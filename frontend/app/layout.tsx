import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexusPump - Token Launchpad on Nexus Testnet III',
  description: 'Create and trade meme tokens with bonding curves on Nexus Layer 1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t border-primary/20 py-8 mt-20">
            <div className="container mx-auto px-4 text-center text-gray-400">
              <p>Built on Nexus Layer 1 Testnet III</p>
              <p className="text-sm mt-2">
                Chain ID: 3945 | RPC: https://testnet.rpc.nexus.xyz
              </p>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  )
}
