'use client'

import { use } from 'react'
import { useAccount } from 'wagmi'
import { useTokenInfo, useTokenBalance } from '@/lib/hooks'
import { BondingCurveChart } from '@/components/BondingCurveChart'
import { TradePanel } from '@/components/TradePanel'
import { CommentSection } from '@/components/CommentSection'
import { formatAddress, formatNEX, formatTimeAgo, calculateProgress } from '@/lib/utils'
import { ExternalLink, Twitter, Globe, MessageCircle, Crown, Loader2 } from 'lucide-react'
import Link from 'next/link'

const GRADUATION_THRESHOLD = 69n * 10n ** 18n // 69 NEX

export default function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address: tokenAddress } = use(params)
  const { address: userAddress } = useAccount()
  
  const { data: tokenInfo, isLoading } = useTokenInfo(tokenAddress as `0x${string}`)
  const { data: userBalance } = useTokenBalance(
    tokenAddress as `0x${string}`,
    userAddress
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!tokenInfo) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Token Not Found</h1>
          <p className="text-gray-400 mb-8">The token you're looking for doesn't exist.</p>
          <Link href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const progress = calculateProgress(tokenInfo.totalRaised, GRADUATION_THRESHOLD)
  const createdAt = Number(tokenInfo.createdAt)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Token Header */}
      <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Token Image */}
          <div className="flex-shrink-0">
            {tokenInfo.imageUrl ? (
              <img
                src={tokenInfo.imageUrl}
                alt={tokenInfo.name}
                className="w-32 h-32 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%238b5cf6"/%3E%3C/svg%3E'
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-5xl font-bold text-primary">
                  {tokenInfo.symbol.slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Token Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {tokenInfo.name}
                  {tokenInfo.graduated && (
                    <Crown className="w-8 h-8 text-yellow-400" />
                  )}
                </h1>
                <p className="text-xl text-gray-400">${tokenInfo.symbol}</p>
              </div>
              
              {tokenInfo.graduated && (
                <span className="px-4 py-2 bg-success/20 text-success rounded-lg font-bold">
                  🎓 Graduated to DEX
                </span>
              )}
            </div>

            <p className="text-gray-300 mb-4">{tokenInfo.description}</p>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mb-4">
              {tokenInfo.website && (
                <a
                  href={tokenInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-card-hover hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tokenInfo.twitter && (
                <a
                  href={`https://twitter.com/${tokenInfo.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-card-hover hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {tokenInfo.telegram && (
                <a
                  href={tokenInfo.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm bg-card-hover hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Telegram
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400">Total Raised</div>
                <div className="text-lg font-bold text-primary">
                  {formatNEX(tokenInfo.totalRaised)} NEX
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Creator</div>
                <Link 
                  href={`/profile/${tokenInfo.creator}`}
                  className="text-lg font-bold text-primary hover:underline"
                >
                  {formatAddress(tokenInfo.creator)}
                </Link>
              </div>
              <div>
                <div className="text-sm text-gray-400">Created</div>
                <div className="text-lg font-bold">
                  {formatTimeAgo(createdAt)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Contract</div>
                <a
                  href={`https://nexus.testnet.blockscout.com/address/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {formatAddress(tokenAddress)}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Progress Bar */}
            {!tokenInfo.graduated && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress to Graduation (69 NEX)</span>
                  <span className="font-bold text-primary">{progress.toFixed(2)}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BondingCurveChart tokenAddress={tokenAddress} />
          <CommentSection tokenAddress={tokenAddress as `0x${string}`} />
        </div>
        
        <div>
          {!tokenInfo.graduated ? (
            <TradePanel
              tokenAddress={tokenAddress as `0x${string}`}
              tokenSymbol={tokenInfo.symbol}
              userBalance={userBalance}
            />
          ) : (
            <div className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4">🎉 Token Graduated!</h2>
              <p className="text-gray-300 mb-4">
                This token has reached the graduation threshold and is now trading on the NexusPump DEX with full liquidity!
              </p>
              <a
                href={`https://nexus.testnet.blockscout.com/address/${tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View on DEX
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
