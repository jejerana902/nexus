'use client'

import { useAllTokens } from '@/lib/hooks'
import { TokenCard } from './TokenCard'
import { Crown } from 'lucide-react'

export function KingOfTheHill() {
  const { data: tokens } = useAllTokens(0, 50)

  // Find the token with highest total raised (closest to or graduated)
  const kingToken = tokens?.reduce((prev, current) => {
    if (!prev) return current
    return Number(current.totalRaised) > Number(prev.totalRaised) ? current : prev
  }, tokens[0])

  if (!kingToken) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary/20 to-success/20 border border-primary/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-gradient">King of the Hill</h2>
      </div>
      <p className="text-gray-300 mb-4">
        {kingToken.graduated 
          ? 'The champion that made it to the DEX!' 
          : 'Leading the race to graduation'}
      </p>
      <TokenCard token={kingToken} />
    </div>
  )
}
