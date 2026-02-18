'use client'

import { use } from 'react'
import { useAllTokens } from '@/lib/hooks'
import { TokenCard } from '@/components/TokenCard'
import { formatAddress } from '@/lib/utils'
import { User, Wallet, TrendingUp, Loader2 } from 'lucide-react'

export default function ProfilePage({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = use(params)
  const { data: allTokens, isLoading } = useAllTokens(0, 100)

  // Filter tokens created by this address
  const createdTokens = allTokens?.filter(
    (token) => token.creator.toLowerCase() === address.toLowerCase()
  ) || []

  // Note: For a full implementation, you'd need to track user holdings
  // This would require additional contract calls or an indexer

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {formatAddress(address)}
            </h1>
            <a
              href={`https://nexus.testnet.blockscout.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View on Explorer →
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background-start border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Tokens Created</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {createdTokens.length}
            </div>
          </div>
          <div className="bg-background-start border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm">Holdings</span>
            </div>
            <div className="text-3xl font-bold">
              -
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Feature coming soon
            </div>
          </div>
          <div className="bg-background-start border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Total Volume</span>
            </div>
            <div className="text-3xl font-bold">
              -
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Feature coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-4 border-b border-primary/20">
          <button className="px-4 py-2 font-semibold text-primary border-b-2 border-primary">
            Created Tokens
          </button>
          <button className="px-4 py-2 font-semibold text-gray-400 hover:text-white transition-colors">
            Holdings (Coming Soon)
          </button>
          <button className="px-4 py-2 font-semibold text-gray-400 hover:text-white transition-colors">
            Trade History (Coming Soon)
          </button>
        </div>
      </div>

      {/* Created Tokens */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : createdTokens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdTokens.map((token) => (
            <TokenCard key={token.tokenAddress} token={token} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-4">No tokens created yet</p>
          <a
            href="/create"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Token
          </a>
        </div>
      )}
    </div>
  )
}
