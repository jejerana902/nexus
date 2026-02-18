'use client'

import Link from 'next/link'
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { formatAddress, formatNEX } from '@/lib/utils'
import { Wallet, LogOut } from 'lucide-react'

export function Header() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <header className="border-b border-primary/20 backdrop-blur-lg bg-card/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gradient">
              NexusPump
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/create" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Create Token
            </Link>
          </nav>

          {/* Wallet */}
          <div className="flex items-center gap-4">
            {isConnected && address ? (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <div className="text-sm text-gray-400">Balance</div>
                  <div className="font-semibold">
                    {balance ? formatNEX(balance.value) : '0'} NEX
                  </div>
                </div>
                <Link
                  href={`/profile/${address}`}
                  className="bg-card hover:bg-card-hover px-4 py-2 rounded-lg border border-primary/30 transition-colors"
                >
                  {formatAddress(address)}
                </Link>
                <button
                  onClick={() => disconnect()}
                  className="p-2 bg-card hover:bg-card-hover rounded-lg border border-primary/30 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
