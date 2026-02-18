'use client'

import Link from 'next/link'
import { formatAddress, formatNEX, formatTimeAgo, calculateProgress } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface TokenInfo {
  tokenAddress: string
  name: string
  symbol: string
  description: string
  imageUrl: string
  website: string
  twitter: string
  telegram: string
  creator: string
  createdAt: bigint
  totalRaised: bigint
  graduated: boolean
}

interface TokenCardProps {
  token: TokenInfo
  showTrending?: boolean
}

const GRADUATION_THRESHOLD = 69n * 10n ** 18n // 69 NEX

export function TokenCard({ token, showTrending }: TokenCardProps) {
  const progress = calculateProgress(token.totalRaised, GRADUATION_THRESHOLD)
  const createdAt = Number(token.createdAt)

  return (
    <Link
      href={`/token/${token.tokenAddress}`}
      className="block bg-card hover:bg-card-hover border border-primary/20 rounded-xl p-4 transition-all hover:scale-[1.02] backdrop-blur-sm"
    >
      <div className="flex gap-4">
        {/* Token Image */}
        <div className="flex-shrink-0">
          {token.imageUrl ? (
            <img
              src={token.imageUrl}
              alt={token.name}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%238b5cf6"/%3E%3C/svg%3E'
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {token.symbol.slice(0, 2)}
              </span>
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg truncate">{token.name}</h3>
                {showTrending && (
                  <TrendingUp className="w-4 h-4 text-success" />
                )}
              </div>
              <p className="text-gray-400 text-sm">${token.symbol}</p>
            </div>
            {token.graduated && (
              <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full font-semibold whitespace-nowrap">
                Graduated 🎓
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">
            {token.description}
          </p>

          {/* Stats */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-400">Raised: </span>
              <span className="font-semibold text-primary">
                {formatNEX(token.totalRaised)} NEX
              </span>
            </div>
            <div className="text-gray-400">
              {formatTimeAgo(createdAt)}
            </div>
          </div>

          {/* Progress Bar */}
          {!token.graduated && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Progress to graduation</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Creator */}
          <div className="mt-2 text-xs text-gray-400">
            by {formatAddress(token.creator)}
          </div>
        </div>
      </div>
    </Link>
  )
}
