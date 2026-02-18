'use client'

import { useAllTokens } from '@/lib/hooks'
import Link from 'next/link'
import { formatNEX, formatAddress } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

export function TrendingTokens() {
  const { data: tokens } = useAllTokens(0, 10)

  // Sort by total raised for trending (in real app, would be by volume)
  const trending = tokens
    ?.filter((t) => !t.graduated)
    .sort((a, b) => Number(b.totalRaised) - Number(a.totalRaised))
    .slice(0, 5) || []

  return (
    <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-success" />
        <h2 className="text-xl font-bold">Trending</h2>
      </div>

      <div className="space-y-4">
        {trending.map((token, index) => (
          <Link
            key={token.tokenAddress}
            href={`/token/${token.tokenAddress}`}
            className="flex items-center gap-3 hover:bg-card-hover p-2 rounded-lg transition-colors"
          >
            <div className="text-lg font-bold text-gray-500 w-6">
              {index + 1}
            </div>
            
            {token.imageUrl ? (
              <img
                src={token.imageUrl}
                alt={token.name}
                className="w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%238b5cf6"/%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {token.symbol.slice(0, 2)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{token.name}</div>
              <div className="text-sm text-gray-400">${token.symbol}</div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-success">
                {formatNEX(token.totalRaised)}
              </div>
              <div className="text-xs text-gray-400">NEX</div>
            </div>
          </Link>
        ))}

        {trending.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No trending tokens yet
          </p>
        )}
      </div>
    </div>
  )
}
